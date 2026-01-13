"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { useLearningRoom } from "@/hooks/queries/useLearning";
import { useLearningStore } from "@/store";
import MissionPracticeModal from "./MissionPracticeModal";
import AllMissionsView from "./AllMissionsView";

interface Mission {
  id: string;
  week: number;
  day: number;
  content: string;
  aiFeedback?: string;
  completed: boolean;
}

interface RoutineData {
  id: string;
  theme: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  progress: number;
  currentWeek: number;
  currentDay: number;
  todayMission?: Mission;
  reviewMission?: Mission;
  upcomingSession?: {
    date: string;
    time: string;
    type: string;
  };
  feedbackSummary?: {
    grammar: string;
    pronunciation: string;
    fluency: string;
    avgGrammar?: number;
    avgPronunciation?: number;
    avgFluency?: number;
  };
}

export default function LearningRoomContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setCurrentRoutine, setMissions, setTodayMission, updateStreak } = useLearningStore();
  
  // Prevent multiple redirects
  const hasRedirected = useRef(false);
  
  // Modal states
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showAllMissions, setShowAllMissions] = useState(false);
  
  // Only fetch learning data when authenticated
  const isAuthenticated = status === "authenticated";
  const { data, isLoading, error, refetch } = useLearningRoom(isAuthenticated);

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (data) {
      if (data.routine) {
        setCurrentRoutine(data.routine);
      }
      if (data.missions) {
        setMissions(data.missions);
      }
      if (data.todayMission) {
        setTodayMission(data.todayMission);
      }
      updateStreak();
    }
  }, [data, setCurrentRoutine, setMissions, setTodayMission, updateStreak]);

  useEffect(() => {
    // Only redirect once to prevent infinite loops
    if (hasRedirected.current) return;
    
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (status === "unauthenticated") {
      hasRedirected.current = true;
      router.push("/signup?callbackUrl=/learning-room");
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // 로딩 중
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <LoadingSkeleton />
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
  
  // 데이터 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <LoadingSkeleton />
      </main>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <ErrorState
          message="학습 데이터를 불러올 수 없습니다"
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  const { name } = session.user;
  const routine = data?.routine;
  const allMissions = data?.missions || [];
  const routineData = data ? {
    id: routine?.id || "",
    theme: routine?.theme || "",
    startDate: routine?.startDate ? String(routine.startDate) : "",
    endDate: routine?.endDate ? String(routine.endDate) : "",
    completed: routine?.completed || false,
    progress: data.progress || 0,
    currentWeek: data.currentWeek || 1,
    currentDay: data.currentDay || 1,
    todayMission: data.todayMission as Mission | undefined,
    reviewMission: data.reviewMission as Mission | undefined,
    upcomingSession: data.upcomingSession,
    feedbackSummary: data.feedbackSummary,
  } : null;

  // Mission handlers
  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
    setShowPracticeModal(true);
  };

  const handleMissionComplete = async (missionId: string, response: string, score: number) => {
    // Refetch data to update UI
    await refetch();
    setShowPracticeModal(false);
    setSelectedMission(null);
  };

  // 루틴이 없는 경우
  if (!data?.routine) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <NoRoutineState />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:gap-4">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            ENGZ AI 학습룸
          </p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            👋 안녕하세요, {name ?? "ENGZ 회원"}님!
          </h1>
          {routineData && (
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-600 sm:text-sm">
                현재 루틴: [{routineData.theme} – {routineData.currentWeek}주차]
              </p>
              <button
                onClick={() => setShowAllMissions(!showAllMissions)}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
              >
                {showAllMissions ? "간단히 보기" : "전체 커리큘럼 보기"}
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {routineData && (
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                학습 진행률
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
            <p className="mt-2 text-xs text-gray-500">
              {data?.completedCount || 0}개 완료 / {data?.totalCount || 0}개 미션
            </p>
          </div>
        )}

        {/* All Missions View (Expandable) */}
        {showAllMissions && routineData && (
          <div className="mb-8">
            <AllMissionsView
              missions={allMissions}
              currentWeek={routineData.currentWeek}
              currentDay={routineData.currentDay}
              onMissionClick={handleMissionClick}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Today's Mission */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              🎯 오늘의 미션
            </h2>
            {routineData?.todayMission ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-[#FFF7F0] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">
                      {routineData.todayMission.week}주차 · {routineData.todayMission.day}일차
                    </p>
                    {routineData.todayMission.completed && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                        완료 ✓
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-900">
                    {routineData.todayMission.content}
                  </p>
                </div>
                {routineData.todayMission.aiFeedback && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="mb-2 text-xs font-semibold text-green-700">
                      ✅ AI 피드백:
                    </p>
                    <p className="text-xs text-gray-600">
                      {routineData.todayMission.aiFeedback}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleMissionClick(routineData.todayMission!)}
                  className="w-full rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
                >
                  🎯 답변 녹음 → AI 피드백 → 90점 이상까지 반복
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  아직 활성화된 루틴이 없습니다. 4주 학습 여정을 시작해 보세요!
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
                >
                  루틴 시작하기 →
                </Link>
              </div>
            )}
          </section>

          {/* Feedback Summary */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              📊 피드백 요약
            </h2>
            {routineData?.feedbackSummary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                    <p className="text-xs text-gray-500">문법</p>
                    <p className="mt-1 text-lg font-bold text-[#F5472C]">
                      {routineData.feedbackSummary.grammar}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                    <p className="text-xs text-gray-500">발음</p>
                    <p className="mt-1 text-lg font-bold text-[#F5472C]">
                      {routineData.feedbackSummary.pronunciation}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                    <p className="text-xs text-gray-500">유창성</p>
                    <p className="mt-1 text-lg font-bold text-[#F5472C]">
                      {routineData.feedbackSummary.fluency}
                    </p>
                  </div>
                </div>
                {routineData.reviewMission && (
                  <button
                    type="button"
                    onClick={() => handleMissionClick(routineData.reviewMission!)}
                    className="w-full rounded-full border border-[#F5472C] px-6 py-2 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
                  >
                    🔁 3일 전 미션 복습하기
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <p className="text-2xl">📈</p>
                <p className="mt-2 text-sm text-gray-600">
                  첫 번째 미션을 완료하면 AI 피드백 요약을 확인할 수 있습니다.
                </p>
              </div>
            )}
          </section>

          {/* Upcoming Session */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              🗓️ 예정된 수업
            </h2>
            {routineData?.upcomingSession ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-[#FFF7F0] p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {routineData.upcomingSession.type}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {routineData.upcomingSession.date}{" "}
                    {routineData.upcomingSession.time}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Zoom으로 참가</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.open("https://zoom.us", "_blank")}
                  className="w-full rounded-full border border-[#F5472C] px-6 py-2 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
                >
                  수업 참가하기 →
                </button>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <p className="text-2xl">📅</p>
                <p className="mt-2 text-sm text-gray-600">
                  예정된 튜터 수업이 없습니다.
                </p>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              ⚡ 빠른 메뉴
            </h2>
            <div className="space-y-3">
              <Link
                href="/report"
                className="flex w-full items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                주간 리포트 보기 →
              </Link>
              <button
                onClick={() => setShowAllMissions(true)}
                className="flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C]"
              >
                전체 미션 보기 →
              </button>
              <Link
                href="/onboarding"
                className="flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C]"
              >
                다음 루틴 미리보기 →
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Mission Practice Modal */}
      {selectedMission && (
        <MissionPracticeModal
          mission={selectedMission}
          isOpen={showPracticeModal}
          onClose={() => {
            setShowPracticeModal(false);
            setSelectedMission(null);
          }}
          onComplete={handleMissionComplete}
        />
      )}
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#F5472C] text-white rounded-lg hover:bg-[#d93d25] transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

function NoRoutineState() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          아직 활성화된 루틴이 없습니다. 4주 학습 여정을 시작해 보세요!
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
        >
          루틴 시작하기 →
        </Link>
      </div>
    </div>
  );
}
