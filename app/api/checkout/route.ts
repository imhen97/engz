import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const MONTHLY_PRICE = process.env.STRIPE_PRICE_MONTHLY_ID;
const ANNUAL_PRICE = process.env.STRIPE_PRICE_ANNUAL_ID;
const APP_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    plan?: string;
  } | null;
  const plan = body?.plan;

  if (plan !== "monthly" && plan !== "annual") {
    return NextResponse.json({ error: "잘못된 플랜입니다." }, { status: 400 });
  }

  const priceId = plan === "annual" ? ANNUAL_PRICE : MONTHLY_PRICE;
  if (!priceId) {
    return NextResponse.json(
      { error: "가격 정보가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe 초기화 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || !user.email) {
    return NextResponse.json(
      { error: "사용자 정보를 확인할 수 없습니다." },
      { status: 400 }
    );
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId: user.id,
        plan,
      },
    },
    metadata: {
      userId: user.id,
      plan,
    },
    allow_promotion_codes: true,
    success_url: `${APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/pricing`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
