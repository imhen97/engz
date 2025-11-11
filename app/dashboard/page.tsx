import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("세션 가져오기 실패:", error);
    redirect("/signup?callbackUrl=/dashboard");
  }

  if (!session?.user) {
    redirect("/signup?callbackUrl=/dashboard");
  }

  const { plan, trialActive, trialEndsAtRaw, subscriptionActive, name } =
    session.user;

  // trialEndsAt이 Date 객체인지 확인하고 안전하게 처리
  let trialEndsAt: Date | null = null;
  if (trialEndsAtRaw) {
    if (trialEndsAtRaw instanceof Date) {
      trialEndsAt = trialEndsAtRaw;
    } else if (typeof trialEndsAtRaw === "string") {
      trialEndsAt = new Date(trialEndsAtRaw);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium tracking-[0.3em] text-[#F5472C]">
            MY ENGZ BOARD
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {name ?? "ENGZ 학습자"}님의 대시보드
          </h1>
          <p className="text-sm text-gray-600">
            현재 플랜 상태와 오늘의 학습 미션을 한눈에 확인하세요.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">구독 상태</h2>
            <p className="mt-2 text-sm text-gray-600">
              현재 이용 중인 플랜:{" "}
              <strong>
                {plan === "free"
                  ? "무료 체험"
                  : plan === "annual"
                  ? "연간 플랜"
                  : "월간 플랜"}
              </strong>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• 무료 체험 상태: {trialActive ? "진행 중" : "종료"}</li>
              <li>• 구독 활성화: {subscriptionActive ? "예" : "아니요"}</li>
              {trialActive && trialEndsAt && !isNaN(trialEndsAt.getTime()) && (
                <li>• 체험 종료일: {trialEndsAt.toLocaleDateString("ko-KR")}</li>
              )}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-5 py-2 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                플랜 변경하기 →
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">오늘의 학습</h2>
            <p className="mt-2 text-sm text-gray-600">
              AI가 준비한 오늘의 미션을 시작해 보세요. 첫 수업은 Week 1 Day
              1부터 자동으로 열립니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/level-test"
                className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                AI 레벨 테스트 보기 →
              </Link>
              <Link
                href="/ai-course"
                className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-5 py-2 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                4주 코스 이어하기 →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
