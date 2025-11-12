"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

const LEVELS = [
  {
    id: "beginner",
    label: "비기너 (Beginner)",
    description: "기초 표현과 인사말 위주로 대화를 이어갈 수 있어요.",
    emoji: "🟢",
    color: "from-green-400 to-green-600",
  },
  {
    id: "intermediate",
    label: "인터미디엇 (Intermediate)",
    description: "내 생각을 말할 수 있지만 문법 실수가 자주 나와요.",
    emoji: "🟠",
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "advanced",
    label: "어드밴스드 (Advanced)",
    description: "다양한 주제에 대해 영어로 깊이 있게 토론할 수 있어요.",
    emoji: "🔵",
    color: "from-blue-400 to-blue-600",
  },
];

export default function LevelTestStartPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLevelSelect = async (levelId: string) => {
    setSelectedLevel(levelId);
    setLoading(true);

    try {
      // Generate test questions based on selected level
      const response = await fetch("/api/leveltest/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: levelId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const data = await response.json();

      // Store test data in sessionStorage
      sessionStorage.setItem(
        "levelTestData",
        JSON.stringify({
          level: levelId,
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
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
          AI 레벨 테스트
          </p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
          지금의 영어 실력은 어느 단계인가요?
          </h1>
          <p className="mt-4 text-sm text-gray-600 sm:text-base">
          내 수준에 맞는 레벨을 선택하면 AI가 맞춤 평가를 준비해 드려요.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {LEVELS.map((level, index) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleLevelSelect(level.id)}
              disabled={loading}
              className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all ${
                selectedLevel === level.id
                  ? "border-[#F5472C] bg-[#FFF7F0] shadow-lg"
                  : "border-gray-200 bg-white hover:border-[#F5472C] hover:shadow-md"
              } ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="mb-4 text-4xl">{level.emoji}</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {level.label}
              </h3>
              <p className="text-sm text-gray-600">{level.description}</p>
              {selectedLevel === level.id && loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5472C] border-t-transparent" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}
