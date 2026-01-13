"use client";

import { useLatestTestResult } from "@/hooks/queries/useLevelTest";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";

export function TestResultContent() {
  const { data: session } = useSession();
  const { data: result, isLoading, error } = useLatestTestResult();

  if (!session) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <LoginPrompt />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <ResultSkeleton />
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <NoResultState />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F4] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="space-y-8">
          <ScoreOverview result={result} />
          <DetailedAnalysis result={result} />
          <Recommendations result={result} />
        </div>
      </div>
    </main>
  );
}

function LoginPrompt() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">로그인이 필요합니다</p>
        <a
          href="/signup"
          className="px-6 py-3 bg-[#F5472C] text-white rounded-lg inline-block"
        >
          로그인하기
        </a>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function NoResultState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">테스트 결과를 찾을 수 없습니다</p>
        <a
          href="/level-test"
          className="px-6 py-3 bg-[#F5472C] text-white rounded-lg inline-block"
        >
          테스트 시작하기
        </a>
      </div>
    </div>
  );
}

function ScoreOverview({ result }: { result: any }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">점수 개요</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Vocabulary</p>
          <p className="text-3xl font-bold text-[#F5472C]">{result.vocabScore}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Grammar</p>
          <p className="text-3xl font-bold text-[#F5472C]">{result.grammarScore}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Writing</p>
          <p className="text-3xl font-bold text-[#F5472C]">{result.writingScore}%</p>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-lg font-semibold">
          Overall Level: {result.overallLevel}
        </p>
      </div>
    </div>
  );
}

function DetailedAnalysis({ result }: { result: any }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">상세 분석</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">강점</h3>
          <p className="text-gray-600">{result.strengths}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">개선점</h3>
          <p className="text-gray-600">{result.weaknesses}</p>
        </div>
      </div>
    </div>
  );
}

function Recommendations({ result }: { result: any }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">추천 루틴</h2>
      <p className="text-gray-600 mb-4">{result.recommendedRoutine}</p>
      <a
        href="/onboarding"
        className="inline-block px-6 py-3 bg-[#F5472C] text-white rounded-lg"
      >
        루틴 시작하기
      </a>
    </div>
  );
}
