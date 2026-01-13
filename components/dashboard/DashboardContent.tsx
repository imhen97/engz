"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import NavBar from "@/components/NavBar";

interface DashboardData {
  currentCourse?: {
    title: string;
    slug: string;
  } | null;
  currentEnrollment?: {
    currentWeek: number;
    currentDay: number;
  } | null;
}

export default function DashboardContent() {
  const { data: session, status } = useSession({
    required: false,
  });
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Timeout for loading state - if stuck in loading for more than 10 seconds, force refresh
  useEffect(() => {
    if (status === "loading") {
      const timeout = setTimeout(() => {
        console.warn("⚠️ 세션 로딩이 10초 이상 지속됨 - 페이지 새로고침");
        setLoadingTimeout(true);
        // Force session refetch
        window.location.reload();
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [status]);

  useEffect(() => {
    console.log("🔵 DashboardContent - Status:", status, "Session:", !!session);
    
    // Only redirect if we're SURE there's no session (not loading)
    // This prevents redirect loops
    if (status === "unauthenticated") {
      console.log("❌ 인증되지 않음 - 로그인 페이지로 리다이렉트");
      // Use replace instead of push to avoid adding to history
      router.replace("/signup?callbackUrl=/dashboard");
      return;
    }

    // 로그인 상태이고 세션이 있으면 데이터 가져오기
    if (status === "authenticated" && session?.user) {
      console.log("✅ 인증됨 - 사용자:", session.user.email);
      
      // 7일 체험 기간 체크
      const trialActive = session.user.trialActive ?? false;
      const subscriptionActive = session.user.subscriptionActive ?? false;

      // Only redirect to pricing if we're CERTAIN user has no trial/subscription
      // Don't redirect immediately for new users (middleware will handle it)
      if (!trialActive && !subscriptionActive) {
        console.log("❌ 체험 기간 종료 - 결제 페이지로 리다이렉트");
        // Use replace to avoid redirect loop
        router.replace("/pricing");
        return;
      }

      // 대시보드 데이터 가져오기
      console.log("📊 대시보드 데이터 가져오기 시작");
      fetch("/api/dashboard/data")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("✅ 대시보드 데이터 가져오기 성공:", data);
          setDashboardData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("❌ 대시보드 데이터 가져오기 실패:", error);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  // 로딩 중
  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5472C] border-t-transparent" />
          <p className="text-sm text-gray-500">
            {loadingTimeout ? "세션을 확인하는 중…" : "로딩 중…"}
          </p>
          {loadingTimeout && (
            <p className="text-xs text-gray-400">
              시간이 오래 걸리면 페이지를 새로고침해 주세요.
            </p>
          )}
        </div>
      </main>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 중)
  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">리다이렉트 중…</p>
        </div>
      </main>
    );
  }

  // 세션이 없는 경우
  if (!session?.user) {
    return null;
  }

  const { plan, trialActive, trialEndsAt, subscriptionActive, name } =
    session.user;
  const currentEnrollment = dashboardData?.currentEnrollment;
  const currentCourse = dashboardData?.currentCourse;

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            MY ENGZ BOARD
          </p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {name ?? "ENGZ 학습자"}님의 대시보드
          </h1>
          <p className="text-xs text-gray-600 sm:text-sm">
            현재 플랜 상태와 오늘의 학습 미션을 한눈에 확인하세요.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:mt-10 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              구독 상태
            </h2>
            <p className="mt-2 text-xs text-gray-600 sm:text-sm">
              현재 이용 중인 플랜:{" "}
              <strong>
                {plan === "free"
                  ? "무료 체험"
                  : plan === "annual"
                  ? "연간 플랜"
                  : "월간 플랜"}
              </strong>
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-gray-600 sm:mt-4 sm:space-y-2 sm:text-sm">
              <li>• 무료 체험 상태: {trialActive ? "진행 중" : "종료"}</li>
              <li>• 구독 활성화: {subscriptionActive ? "예" : "아니요"}</li>
              {trialActive &&
                trialEndsAt &&
                !isNaN(new Date(trialEndsAt).getTime()) && (
                  <li>
                    • 체험 종료일:{" "}
                    {new Date(trialEndsAt).toLocaleDateString("ko-KR")}
                  </li>
                )}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-4 py-1.5 text-xs font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
              >
                플랜 변경하기 →
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              오늘의 학습
            </h2>
            {currentEnrollment && currentCourse ? (
              <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                <div className="rounded-lg bg-[#FFF7F0] p-3 sm:rounded-xl sm:p-4">
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                    {currentCourse.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Week {currentEnrollment.currentWeek} · Day{" "}
                    {currentEnrollment.currentDay}
                  </p>
                </div>
                <Link
                  href={`/courses/${currentCourse.slug}/week/${currentEnrollment.currentWeek}/day/${currentEnrollment.currentDay}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:scale-105 sm:px-5 sm:py-3 sm:text-sm"
                >
                  오늘의 수업 시작하기 →
                </Link>
              </div>
            ) : (
              <>
                <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                  AI가 준비한 오늘의 미션을 시작해 보세요. 첫 수업은 Week 1 Day
                  1부터 자동으로 열립니다.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Link
                    href="/level-test"
                    className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:scale-105 sm:px-5 sm:text-sm"
                  >
                    AI 레벨 테스트 보기 →
                  </Link>
                  <Link
                    href="/ai-course"
                    className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-4 py-2 text-xs font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:px-5 sm:text-sm"
                  >
                    4주 코스 시작하기 →
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

