import Link from "next/link";
import { getServerSession } from "next-auth";

import NavBar from "@/components/NavBar";
import PricingCard from "@/components/pricing/PricingCard";
import { authOptions } from "@/lib/auth";

// Force dynamic rendering since we use getServerSession
export const dynamic = "force-dynamic";

const plans = [
  {
    id: "monthly" as const,
    title: "월간 플랜",
    subtitle: "가장 많이 선택한 플랜",
    price: "₩49,000 / 월",
    description:
      "모든 ENGZ AI 코스를 제한 없이 이용하고 주간 리포트를 받아보세요.",
    features: [
      "AI 레벨 테스트 + 맞춤 성장 리포트",
      "모든 집중 코스 & 미션 전체 이용",
      "주 1회 AI 피드백 요약",
    ],
    highlight: true,
    buttonVariant: "solid" as const,
  },
  {
    id: "annual" as const,
    title: "연간 플랜",
    price: "₩39,000 / 월",
    description:
      "연간 결제로 월 요금 대비 약 2개월을 절약하고 우선 지원을 받으세요.",
    features: [
      "월간 플랜의 모든 혜택 포함",
      "우선 순위 AI 코치 지원",
      "신규 기능 및 베타 프로그램 우선 참여",
    ],
    highlight: false,
    buttonVariant: "outline" as const,
  },
];

export default async function PricingPage() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("세션 가져오기 실패:", error);
    session = null;
  }

  const activePlan = session?.user?.plan ?? "free";
  const trialActive = session?.user?.trialActive ?? false;
  const trialEndsAt = session?.user?.trialEndsAt ?? null;
  const subscriptionActive = session?.user?.subscriptionActive ?? false;

  const trialMessage = trialActive
    ? trialEndsAt && !isNaN(trialEndsAt.getTime())
      ? `무료 체험이 ${trialEndsAt.toLocaleDateString(
          "ko-KR"
        )}까지 남아 있습니다. 체험 기간이 끝나기 전에 언제든지 취소할 수 있습니다.`
      : "무료 체험이 진행 중입니다. 체험이 끝나기 전에 언제든지 취소할 수 있습니다."
    : "체험을 시작해도 오늘은 결제되지 않으며, 7일 동안 모두 무료로 이용할 수 있습니다.";

  const getButtonLabel = (plan: "monthly" | "annual") => {
    if (subscriptionActive && activePlan === plan) {
      return "현재 이용 중";
    }
    return "7일 무료 체험 시작";
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] text-black">
      <NavBar />

      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pt-24 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-20 md:px-8 lg:px-10 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#FFF7F5]" />
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            요금제 안내
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl lg:text-5xl">
            ENGZ AI와 함께할 요금제를 선택해 보세요
          </h1>
          <p className="mt-4 text-xs text-gray-600 sm:mt-6 sm:text-sm md:text-base lg:text-lg">
            목표에 맞춰 성장하는 유연한 플랜을 선택하세요. 7일 무료 체험 후에
            자동으로 갱신되며, 체험 기간 중 언제든지 취소할 수 있습니다.
          </p>
          <p className="mt-4 text-xs text-gray-500 sm:text-sm">
            {trialMessage}
          </p>
          {!session?.user && (
            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              아직 계정이 없다면{" "}
              <Link href="/signup" className="underline">
                회원가입 후 결제를 진행해 주세요.
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 md:px-8 lg:px-10 lg:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan.id}
              title={plan.title}
              subtitle={plan.subtitle}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              highlight={plan.highlight}
              buttonVariant={plan.buttonVariant}
              buttonLabel={getButtonLabel(plan.id)}
              disabled={subscriptionActive && activePlan === plan.id}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-gray-100 bg-white p-5 text-center shadow sm:mt-10 sm:rounded-3xl sm:p-6 md:mt-12 md:p-8">
          <p className="text-xs text-gray-600 sm:text-sm">
            오늘은 결제되지 않습니다. 7일 체험이 종료되면 선택한 플랜으로 자동
            갱신되며, 체험 중에는 언제든지 취소할 수 있습니다. 결제나 구독 관련
            문의는 ENGZ 팀이 빠르게 도와드립니다.
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
