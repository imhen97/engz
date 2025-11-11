import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";
import { startDefaultCourseForUser } from "@/lib/progress";
import { getStripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY_ID;
const annualPriceId = process.env.STRIPE_PRICE_ANNUAL_ID;

function resolvePlanFromPrice(priceId?: string | null) {
  if (!priceId) return "monthly";
  if (priceId === "annual" || priceId === annualPriceId) return "annual";
  if (priceId === "monthly" || priceId === monthlyPriceId) return "monthly";
  return "monthly";
}

async function updateUserSubscription({
  userId,
  plan,
  subscriptionId,
  status,
  trialEnd,
}: {
  userId: string;
  plan: string;
  subscriptionId?: string | null;
  status?: Stripe.Subscription.Status;
  trialEnd?: number | null;
}) {
  const trialActive = status === "trialing" && Boolean(trialEnd);
  const trialEndsAt = trialEnd ? new Date(trialEnd * 1000) : null;
  const subscriptionActive = status === "active" || status === "trialing";

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      subscriptionId: subscriptionId ?? undefined,
      subscriptionActive,
      trialActive,
      trialEndsAt,
    },
  });
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = headers().get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json(
      { error: "웹훅 시크릿이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "웹훅 검증 실패";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = resolvePlanFromPrice(session.metadata?.plan);

        if (!userId) break;

        let subscription: Stripe.Subscription | null = null;
        if (session.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
        }

        await updateUserSubscription({
          userId,
          plan,
          subscriptionId:
            subscription?.id ?? (session.subscription as string | undefined),
          status: subscription?.status,
          trialEnd: subscription?.trial_end ?? null,
        });

        await startDefaultCourseForUser(userId);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId =
          (subscription.metadata?.userId as string | undefined) ??
          (
            await prisma.user.findFirst({
              where: { subscriptionId: subscription.id },
              select: { id: true },
            })
          )?.id;

        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const plan = resolvePlanFromPrice(priceId);

        await updateUserSubscription({
          userId,
          plan,
          subscriptionId: subscription.id,
          status: subscription.status,
          trialEnd: subscription.trial_end,
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription?: string | Stripe.Subscription | null;
        };
        const subscriptionValue = invoice.subscription;
        const subscriptionId =
          typeof subscriptionValue === "string"
            ? subscriptionValue
            : subscriptionValue?.id;
        if (!subscriptionId) break;
        await prisma.user.updateMany({
          where: { subscriptionId },
          data: {
            subscriptionActive: false,
            plan: "free",
            trialActive: false,
          },
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            subscriptionActive: false,
            trialActive: false,
            plan: "free",
          },
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "웹훅 처리 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
