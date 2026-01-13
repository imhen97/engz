"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

import CheckoutButton from "@/components/pricing/CheckoutButton";
import NavBar from "@/components/NavBar";

type LevelKey = "beginner" | "intermediate" | "advanced" | "custom";

interface LevelResult {
  id: string;
  levelSelected: string | null;
  vocabScore: number;
  grammarScore: number;
  writingScore: number;
  totalScore?: number;
  avgSpeed?: number | null;
  rankPercent?: number | null;
  overallLevel: string;
  strengths: string;
  weaknesses: string;
  recommendedRoutine: string;
  aiFeedback: string;
  aiPlan: string;
  aiMent?: string | null;
  createdAt: string;
}

const LEVEL_DESCRIPTIONS: Record<
  LevelKey,
  {
    titleKo: string;
    titleEn: string;
    summary: string;
  }
> = {
  beginner: {
    titleKo: "기초 탄탄형",
    titleEn: "Confident Beginner",
    summary:
      "기초 문법과 표현을 빠르게 다듬으면 곧바로 말하기에 자신감이 붙습니다. 가장 중요한 것은 짧더라도 매일 영어를 사용하는 루틴입니다.",
  },
  intermediate: {
    titleKo: "도약 준비형",
    titleEn: "Rising Communicator",
    summary:
      "문장을 만들 수 있지만 자연스러움과 정확도를 조금 더 다듬어야 할 단계입니다. 응용 표현과 실전형 과제에 집중할수록 성장 속도가 빨라집니다.",
  },
  advanced: {
    titleKo: "프로 스피커형",
    titleEn: "Advanced Speaker",
    summary:
      "복잡한 문장을 운영할 수 있는 단계입니다. 뉘앙스 조정과 고급 표현을 확장해 스피킹과 라이팅에서 전문성을 보여주세요.",
  },
  custom: {
    titleKo: "맞춤 성장형",
    titleEn: "Tailored Learner",
    summary:
      "점수 데이터를 기반으로 맞춤 전략을 제안해 드립니다. AI 플랜을 따라가며 루틴을 지키면 체감 성장 속도가 빨라집니다.",
  },
};

const SECTION_DETAILS = [
  {
    key: "vocabulary" as const,
    label: "어휘 (Vocabulary)",
    description:
      "일상 대화와 주제별 표현이 얼마나 다양하게 준비되어 있는지 확인합니다.",
  },
  {
    key: "grammar" as const,
    label: "문법 (Grammar)",
    description:
      "문장 구조와 시제, 가정법 등 정확성을 중심으로 안정감을 평가합니다.",
  },
  {
    key: "writing" as const,
    label: "작문 (Writing)",
    description:
      "아이디어 구성, 문장 흐름, 어휘 선택을 통해 논리적인 전달력을 살펴봅니다.",
  },
];

export default function LevelTestResultPage() {
  const router = useRouter();
  const { status } = useSession();
  const [result, setResult] = useState<LevelResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔎 LevelTestResult status:", status);
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup?callbackUrl=/level-test/result");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchLatestResult = async () => {
      console.log("🔎 Fetching /api/leveltest/result/latest …");
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/leveltest/result/latest", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/signup?callbackUrl=/level-test/result");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "결과를 불러오지 못했습니다.");
        }

        if (isMounted) {
          setResult({
            ...data,
            createdAt: data.createdAt,
          });
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error("❌ 레벨 테스트 결과 조회 실패:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "결과를 불러오는 중 문제가 발생했습니다."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLatestResult();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [status, router]);

  const levelInfo = useMemo(() => {
    if (!result) {
      return LEVEL_DESCRIPTIONS.custom;
    }
    const normalizedLevel = result.levelSelected
      ? (result.levelSelected.toLowerCase() as LevelKey)
      : "custom";
    const key = LEVEL_DESCRIPTIONS[normalizedLevel]
      ? normalizedLevel
      : "custom";
    return LEVEL_DESCRIPTIONS[key] ?? LEVEL_DESCRIPTIONS.custom;
  }, [result]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF6B3D] border-t-transparent" />
          로그인 상태를 확인하는 중입니다…
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF6B3D] border-t-transparent" />
          리다이렉트 중…
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF6B3D] border-t-transparent" />
          AI 코치가 결과를 정리하는 중입니다…
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-[#FFF8F4] text-black">
        <NavBar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-gray-600">
            {error ?? "레벨 테스트 결과를 불러올 수 없습니다."}
          </p>
          {error?.includes("인증") || error?.includes("로그인") ? (
            <Link
              href="/signup?callbackUrl=/level-test/result"
              className="rounded-full bg-[#FF6B3D] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              로그인하고 결과 보기
            </Link>
          ) : (
            <Link
              href="/level-test/start"
              className="rounded-full bg-[#FF6B3D] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              레벨 테스트 다시 시작하기
            </Link>
          )}
        </div>
      </main>
    );
  }

  const avgScore = Math.round(
    ((result.vocabScore ?? 0) +
      (result.grammarScore ?? 0) +
      (result.writingScore ?? 0)) /
      3
  );

  const planLines = result.aiPlan
    ? result.aiPlan
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-[#FFF8F4] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 md:px-8 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm sm:p-10"
        >
          <div className="flex flex-col gap-6 text-center sm:gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE2D4] text-4xl"
            >
              ✨
            </motion.div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.35em] text-[#FF6B3D]/70">
                ENGZ AI 레벨 분석
              </p>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                나만을 위한 AI 학습 리포트
              </h1>
              <p className="text-sm text-gray-600">
                AI 코치가 분석한 레벨과 강·약점을 확인하고, 4주 맞춤 플랜으로
                학습을 시작해 보세요.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#FFF2EA] p-6 text-left shadow-inner">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B3D]/70">
                  레벨 요약
                </p>
                <h2 className="mt-3 text-2xl font-bold text-[#FF6B3D]">
                  {levelInfo.titleKo}
                </h2>
                <p className="text-sm text-[#B34724]">
                  영문 레벨명: {levelInfo.titleEn}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p>• AI 진단 레벨: {result.overallLevel}</p>
                  {result.levelSelected && (
                    <p>• 선택 수준: {result.levelSelected}</p>
                  )}
                  <p>• 종합 점수(평균): {result.totalScore || avgScore}점</p>
                  {result.avgSpeed && (
                    <p>
                      • 평균 풀이속도: {result.avgSpeed.toFixed(1)}초 / 문제
                    </p>
                  )}
                  {result.rankPercent !== null &&
                    result.rankPercent !== undefined && (
                      <p>
                        • 상위 {100 - result.rankPercent}% (전 세계 사용자 중)
                      </p>
                    )}
                </div>
              </div>
              <div className="rounded-3xl border border-[#FFE2D4] bg-white p-6 text-left shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B3D]/70">
                  코치 한줄 코멘트
                </p>
                {result.aiMent && (
                  <p className="mt-3 text-base font-semibold text-[#FF6B3D]">
                    {result.aiMent}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                  {levelInfo.summary}
                </p>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-[#F5FFF5] p-3 text-green-700 shadow-sm">
                    <span className="font-semibold">강점</span> ·{" "}
                    {result.strengths || "데이터 수집 중"}
                  </div>
                  <div className="rounded-2xl bg-[#FFF4E8] p-3 text-[#B34724] shadow-sm">
                    <span className="font-semibold">개선 포인트</span> ·{" "}
                    {result.weaknesses || "추가 분석 예정"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 grid gap-6 sm:grid-cols-3"
        >
          {SECTION_DETAILS.map((section, index) => {
            const score =
              section.key === "vocabulary"
                ? result.vocabScore
                : section.key === "grammar"
                ? result.grammarScore
                : result.writingScore;
            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * (index + 1) }}
                className="rounded-3xl border border-white/40 bg-white p-6 shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FF6B3D]/70">
                  {section.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-[#FF6B3D]">
                  {score}/10
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {section.description}
                </p>
              </motion.div>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-8 lg:grid-cols-2"
        >
          <div className="rounded-3xl border border-[#FFE2D4] bg-white p-7 shadow-lg">
            <h3 className="text-lg font-bold text-[#FF6B3D]">AI 코치 피드백</h3>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700">
              {result.aiFeedback}
            </p>
          </div>
          <div className="rounded-3xl border border-[#FFE2D4] bg-[#FFF2EA] p-7 shadow-lg">
            <h3 className="text-lg font-bold text-[#B34724]">4주 집중 플랜</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#8A3C1E]">
              {planLines.length > 0 ? (
                planLines.map((line, idx) => (
                  <li
                    key={idx}
                    className="rounded-2xl bg-white/70 px-4 py-3 shadow-sm"
                  >
                    {line}
                  </li>
                ))
              ) : (
                <li>
                  AI 플랜이 생성되는 중입니다. 잠시 후 다시 확인해 주세요.
                </li>
              )}
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 rounded-3xl bg-gradient-to-r from-[#FF6B3D] to-[#FF905F] p-8 text-white shadow-2xl sm:p-10"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                다음 단계
              </p>
              <h3 className="text-2xl font-bold sm:text-3xl">
                AI 추천 루틴으로 7일간 무료 체험을 시작하세요
              </h3>
              <p className="text-sm text-white/80">
                첫 7일은 무료, 이후 자동으로 월간 플랜으로 전환됩니다. 언제든지
                해지할 수 있어요.
              </p>
            </div>
            <div className="w-full max-w-xs">
              <CheckoutButton
                plan="monthly"
                label="맞춤 코스 시작하기 – 7일 무료 체험"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600"
        >
          <Link
            href="/level-test/start"
            className="rounded-full border border-[#FF6B3D] px-5 py-2.5 font-semibold text-[#FF6B3D] transition hover:bg-[#FF6B3D] hover:text-white"
          >
            레벨 테스트 다시 보기
          </Link>
          <Link
            href="/learning-room"
            className="rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:border-[#FF6B3D] hover:text-[#FF6B3D]"
          >
            학습룸으로 이동
          </Link>
          <span className="text-xs text-gray-400">
            * 모든 레벨 분석은 영어 문제 데이터를 기반으로 산출됩니다.
          </span>
        </motion.section>
      </div>
    </main>
  );
}
