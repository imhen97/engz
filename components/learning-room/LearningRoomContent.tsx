"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

interface RoutineData {
  id: string;
  theme: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  progress: number;
  currentWeek: number;
  currentDay: number;
  todayMission?: {
    id: string;
    week: number;
    day: number;
    content: string;
    aiFeedback?: string;
    completed: boolean;
  };
  upcomingSession?: {
    date: string;
    time: string;
    type: string;
  };
  feedbackSummary?: {
    grammar: string;
    pronunciation: string;
    fluency: string;
  };
}

export default function LearningRoomContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [routineData, setRoutineData] = useState<RoutineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (status === "unauthenticated") {
      router.push("/signup?callbackUrl=/learning-room");
      return;
    }

    // 로그인 상태이고 세션이 있으면 데이터 가져오기
    if (status === "authenticated" && session?.user) {
      // 7일 체험 기간 체크
      const trialActive = session.user.trialActive ?? false;
      const subscriptionActive = session.user.subscriptionActive ?? false;

      if (!trialActive && !subscriptionActive) {
        router.push("/pricing");
        return;
      }

      // Learning Room 데이터 가져오기
      fetch("/api/learning-room/data")
        .then((res) => res.json())
        .then((data) => {
          setRoutineData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Learning Room 데이터 가져오기 실패:", error);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  // 로딩 중
  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
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

  const { name } = session.user;

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:gap-4">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            ENGZ AI LEARNING ROOM
          </p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            👋 Hello, {name ?? "ENGZ Learner"}!
          </h1>
          {routineData && (
            <p className="text-xs text-gray-600 sm:text-sm">
              Your current routine: [{routineData.theme} – Week{" "}
              {routineData.currentWeek}]
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {routineData && (
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Progress
              </span>
              <span className="text-sm font-semibold text-[#F5472C]">
                {routineData.progress}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F5472C] to-[#ff6a3c] transition-all duration-500"
                style={{ width: `${routineData.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Today's Mission */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              Today&apos;s Mission
            </h2>
            {routineData?.todayMission ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-[#FFF7F0] p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Week {routineData.todayMission.week} · Day{" "}
                    {routineData.todayMission.day}
                  </p>
                  <p className="mt-2 text-sm text-gray-900">
                    {routineData.todayMission.content}
                  </p>
                </div>
                {routineData.todayMission.aiFeedback && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="mb-2 text-xs font-semibold text-gray-700">
                      AI Feedback:
                    </p>
                    <p className="text-xs text-gray-600">
                      {routineData.todayMission.aiFeedback}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  className="w-full rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
                >
                  🎯 Record your answer → AI feedback → Repeat until 90+ score
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  No active routine yet. Start your first 4-week learning
                  journey!
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
                >
                  Start Onboarding →
                </Link>
              </div>
            )}
          </section>

          {/* Feedback Summary */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              Feedback Summary
            </h2>
            {routineData?.feedbackSummary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                    <p className="text-xs text-gray-500">Grammar</p>
                    <p className="mt-1 text-lg font-bold text-[#F5472C]">
                      {routineData.feedbackSummary.grammar}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                    <p className="text-xs text-gray-500">Pronunciation</p>
                    <p className="mt-1 text-lg font-bold text-[#F5472C]">
                      {routineData.feedbackSummary.pronunciation}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                    <p className="text-xs text-gray-500">Fluency</p>
                    <p className="mt-1 text-lg font-bold text-[#F5472C]">
                      {routineData.feedbackSummary.fluency}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full border border-[#F5472C] px-6 py-2 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
                >
                  🔁 Review missions from 3 days ago
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Complete your first mission to see AI feedback summary.
              </p>
            )}
          </section>

          {/* Upcoming Session */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              Upcoming Session
            </h2>
            {routineData?.upcomingSession ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-[#FFF7F0] p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    🗓️ 1:1 Tutor Call
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {routineData.upcomingSession.date} at{" "}
                    {routineData.upcomingSession.time}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Join via Zoom
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full border border-[#F5472C] px-6 py-2 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
                >
                  Join Session →
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No upcoming tutor session scheduled.
              </p>
            )}
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/report"
                className="flex w-full items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                View Weekly Report →
              </Link>
              <Link
                href="/onboarding"
                className="flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C]"
              >
                Next Routine Preview →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

