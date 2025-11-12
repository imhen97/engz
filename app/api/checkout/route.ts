import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const MONTHLY_PRICE = process.env.STRIPE_PRICE_MONTHLY_ID;
const ANNUAL_PRICE = process.env.STRIPE_PRICE_ANNUAL_ID;
const APP_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("❌ Checkout 요청: 인증되지 않은 사용자");
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as {
      plan?: string;
    } | null;
    const plan = body?.plan;

    if (plan !== "monthly" && plan !== "annual") {
      console.log("❌ Checkout 요청: 잘못된 플랜", plan);
      return NextResponse.json({ error: "잘못된 플랜입니다." }, { status: 400 });
    }

    const priceId = plan === "annual" ? ANNUAL_PRICE : MONTHLY_PRICE;
    if (!priceId) {
      console.error("❌ Checkout 요청: 가격 ID가 설정되지 않음", {
        plan,
        MONTHLY_PRICE: !!MONTHLY_PRICE,
        ANNUAL_PRICE: !!ANNUAL_PRICE,
      });
      return NextResponse.json(
        { error: "가격 정보가 설정되지 않았습니다. 관리자에게 문의해 주세요." },
        { status: 500 }
      );
    }

    let stripe;
    try {
      stripe = getStripe();
    } catch (error) {
      console.error("❌ Checkout 요청: Stripe 초기화 실패", error);
      const message =
        error instanceof Error ? error.message : "Stripe 초기화 실패";
      return NextResponse.json(
        { error: "결제 시스템을 초기화할 수 없습니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user || !user.email) {
      console.error("❌ Checkout 요청: 사용자 정보 없음", { userId: session.user.id });
      return NextResponse.json(
        { error: "사용자 정보를 확인할 수 없습니다. 다시 로그인해 주세요." },
        { status: 400 }
      );
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      try {
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
        console.log("✅ Stripe 고객 생성 완료:", customerId);
      } catch (error) {
        console.error("❌ Checkout 요청: Stripe 고객 생성 실패", error);
        return NextResponse.json(
          { error: "고객 정보를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
          { status: 500 }
        );
      }
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        payment_method_types: ["card", "kakao"] as any, // 카카오페이 추가 (타입 단언 필요)
        locale: "ko", // 한국어 로케일 설정 (카카오페이 표시 최적화)
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

      console.log("✅ Checkout 세션 생성 완료:", checkoutSession.id);
      return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
      console.error("❌ Checkout 요청: Stripe 세션 생성 실패", error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "결제 세션을 생성하는 중 오류가 발생했습니다.";
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Checkout 요청: 예상치 못한 오류", error);
    return NextResponse.json(
      { error: "예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
