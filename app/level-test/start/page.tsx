"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

export default function LevelTestStartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartTest = async () => {
    setLoading(true);

    try {
      // Generate adaptive test (no level selection - PRD requirement)
      // Use intermediate as default starting point for adaptive test
      const response = await fetch("/api/leveltest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: "intermediate" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const data = await response.json();

      // Store test data in sessionStorage
      sessionStorage.setItem(
        "levelTestData",
        JSON.stringify({
          level: null, // No level selection for gamified test
          vocabQuestions: data.vocabQuestions,
          grammarQuestions: data.grammarQuestions,
          writingPrompts: data.writingPrompts,
        })
      );

      // Navigate to vocabulary section
      router.push("/level-test/vocab");
    } catch (error) {
      console.error("테스트 생성 실패:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F4] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#FF6B3D]/70 sm:text-sm">
            ENGZ AI 레벨 테스트
          </p>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            현재 내 진짜 영어 실력은
            <br />
            어느 정도 수준일까?
          </h1>
          <p className="mt-6 text-base text-gray-600 sm:text-lg">
            AI가 당신의 어휘, 문법, 작문 능력을 분석하고
            <br />전 세계 사용자 중 어디에 위치해 있는지 알려드립니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={handleStartTest}
            disabled={loading}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#FF6B3D] to-[#ff8a5c] px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>테스트 준비 중...</span>
              </div>
            ) : (
              <span className="relative z-10">🟠 지금 바로 테스트 해보기</span>
            )}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
