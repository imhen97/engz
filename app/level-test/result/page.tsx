"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import NavBar from "@/components/NavBar";

interface TestResult {
  id: string;
  levelSelected: string;
  vocabScore: number;
  grammarScore: number;
  writingScore: number;
  overallLevel: string;
  strengths: string;
  weaknesses: string;
  recommendedRoutine: string;
}

export default function LevelTestResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resultId = sessionStorage.getItem("levelTestResultId");
    if (!resultId) {
      router.push("/level-test/start");
      return;
    }

    // Handle temporary results (anonymous users)
    if (resultId.startsWith("temp_")) {
      const testData = sessionStorage.getItem("levelTestData");
      const submitData = sessionStorage.getItem("levelTestSubmitData");
      if (submitData) {
        const data = JSON.parse(submitData);
        setResult(data);
        setLoading(false);
        return;
      }
    }

    // Fetch from API for logged-in users
    fetch(`/api/leveltest/result/${resultId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // Try to get from sessionStorage as fallback
          const submitData = sessionStorage.getItem("levelTestSubmitData");
          if (submitData) {
            setResult(JSON.parse(submitData));
          }
        } else {
          setResult(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("결과 가져오기 실패:", error);
        // Try to get from sessionStorage as fallback
        const submitData = sessionStorage.getItem("levelTestSubmitData");
        if (submitData) {
          setResult(JSON.parse(submitData));
        }
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F5472C] border-t-transparent" />
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">결과를 찾을 수 없습니다.</p>
        </div>
      </main>
    );
  }

  const avgScore = Math.round(
    (result.vocabScore + result.grammarScore + result.writingScore) / 3
  );

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6 text-6xl"
          >
            ✨
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Test Complete!
          </h1>
          <p className="mt-4 text-lg font-semibold text-[#F5472C] sm:text-xl">
            Your English Level: {result.overallLevel}
          </p>
        </motion.div>

        {/* Score Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
          >
            <p className="text-sm font-medium text-gray-500">Vocabulary</p>
            <p className="mt-2 text-3xl font-bold text-[#F5472C]">
              {result.vocabScore}%
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
          >
            <p className="text-sm font-medium text-gray-500">Grammar</p>
            <p className="mt-2 text-3xl font-bold text-[#F5472C]">
              {result.grammarScore}%
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
          >
            <p className="text-sm font-medium text-gray-500">Writing</p>
            <p className="mt-2 text-3xl font-bold text-[#F5472C]">
              {result.writingScore}%
            </p>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-green-900">
              ✅ Strengths
            </h3>
            <p className="text-sm text-green-800">{result.strengths}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-orange-900">
              ⚠️ Weaknesses
            </h3>
            <p className="text-sm text-orange-800">{result.weaknesses}</p>
          </motion.div>
        </div>

        {/* Recommended Routine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 rounded-2xl border border-[#F5472C] bg-[#FFF7F0] p-8 shadow-lg"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🎯 Recommended Routine
          </h3>
          <p className="mb-6 text-base text-gray-700">
            {result.recommendedRoutine}
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
          >
            Start your personalized course →
          </Link>
        </motion.div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/level-test/start"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C]"
          >
            Retake Test
          </Link>
          <Link
            href="/learning-room"
            className="rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
          >
            Go to Learning Room
          </Link>
        </div>
      </div>
    </main>
  );
}

