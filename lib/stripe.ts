import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

let stripeClient: Stripe | null = null;

if (secretKey) {
  stripeClient = new Stripe(secretKey);
} else {
  console.warn("STRIPE_SECRET_KEY 환경 변수가 설정되지 않았습니다.");
}

export function getStripe() {
  if (!stripeClient) {
    throw new Error(
      "Stripe 클라이언트를 초기화할 수 없습니다. 환경 변수를 확인해 주세요."
    );
  }
  return stripeClient;
}
