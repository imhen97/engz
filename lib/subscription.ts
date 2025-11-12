import prisma from "./prisma";
import { getStripe } from "./stripe";

const MONTHLY_PRICE = process.env.STRIPE_PRICE_MONTHLY_ID;
const ANNUAL_PRICE = process.env.STRIPE_PRICE_ANNUAL_ID;

/**
 * Check if trial has ended and automatically start subscription
 */
export async function checkAndStartSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("❌ 사용자를 찾을 수 없습니다:", userId);
      return;
    }

    // 이미 구독이 활성화되어 있으면 스킵
    if (user.subscriptionActive) {
      return;
    }

    // 체험이 아직 활성화되어 있으면 스킵
    if (user.trialActive && user.trialEndsAt) {
      const now = new Date();
      const trialEnd = new Date(user.trialEndsAt);
      if (trialEnd > now) {
        return; // 아직 체험 기간 중
      }
    }

    // 체험 기간이 종료되었고 구독이 없으면 자동으로 구독 시작
    if (!user.stripeCustomerId) {
      console.log("⚠️ Stripe 고객 ID가 없습니다. 구독을 시작할 수 없습니다.");
      return;
    }

    const plan = user.plan === "annual" ? "annual" : "monthly";
    const priceId = plan === "annual" ? ANNUAL_PRICE : MONTHLY_PRICE;

    if (!priceId) {
      console.error("❌ 가격 ID가 설정되지 않았습니다.");
      return;
    }

    const stripe = getStripe();

    // Create subscription with trial period already ended
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: priceId }],
      metadata: {
        userId: user.id,
        plan,
      },
    });

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionActive: true,
        subscriptionId: subscription.id,
        trialActive: false,
        plan,
      },
    });

    console.log("✅ 자동 구독 시작 완료:", {
      userId: user.id,
      subscriptionId: subscription.id,
      plan,
    });
  } catch (error) {
    console.error("❌ 자동 구독 시작 실패:", error);
    // 오류가 발생해도 사용자 경험을 방해하지 않도록 함
  }
}

