"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";

const THEMES = [
  {
    id: "grammar",
    label: "문법 집중",
    description: "영어 문법의 기초부터 탄탄하게",
  },
  {
    id: "slang",
    label: "슬랭 & 관용구",
    description: "일상에서 자주 쓰이는 표현 마스터",
  },
  {
    id: "business",
    label: "비즈니스 영어",
    description: "프로페셔널한 커뮤니케이션 스킬",
  },
  {
    id: "travel",
    label: "여행 영어",
    description: "여행자를 위한 필수 표현",
  },
  {
    id: "speaking",
    label: "AI 스피킹",
    description: "발음과 유창성 향상 집중 훈련",
  },
];

export default function OnboardingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup?callbackUrl=/onboarding");
    }
  }, [status, router]);

  const handleStartRoutine = async () => {
    if (!selectedTheme || !session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/routines/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedTheme }),
      });

      if (!response.ok) {
        throw new Error("Failed to create routine");
      }

      router.push("/learning-room");
    } catch (error) {
      console.error("루틴 생성 실패:", error);
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            AI 루틴 설정
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:mt-4 sm:text-3xl md:text-4xl">
            4주 학습 테마를 선택하세요
          </h1>
          <p className="mt-3 text-xs text-gray-600 sm:mt-4 sm:text-sm md:text-base">
            집중하고 싶은 테마를 선택하면, AI가 매일 맞춤형 미션을 생성해 드립니다.
            4주 동안 꾸준히 학습하며 영어 실력을 키워보세요.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedTheme(theme.id)}
              className={`rounded-2xl border-2 p-6 text-left transition-all ${
                selectedTheme === theme.id
                  ? "border-[#F5472C] bg-[#FFF7F0] shadow-lg"
                  : "border-gray-200 bg-white hover:border-[#F5472C] hover:shadow-md"
              }`}
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {theme.label}
              </h3>
              <p className="text-xs text-gray-600 sm:text-sm">
                {theme.description}
              </p>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleStartRoutine}
            disabled={!selectedTheme || loading}
            className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 sm:px-10 sm:py-4 sm:text-base"
          >
            {loading ? "루틴 생성 중..." : "4주 루틴 시작하기 →"}
          </button>
        </div>
      </div>
    </main>
  );
}
