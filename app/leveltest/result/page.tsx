"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import NavBar from "@/components/NavBar";

type TestResult = {
  id: string;
  vocabScore: number;
  grammarScore: number;
  writingScore: number;
  totalScore: number;
  avgSpeed: number;
  percentile: number;
  overallLevel: string;
  strengths: string;
  weaknesses: string;
  recommendedRoutine: string;
};

function QuickTestResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resultId) {
      setError("결과 ID가 없습니다.");
      setLoading(false);
      return;
    }

    // Fetch result from API
    fetch(`/api/leveltest/result/${resultId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch result:", err);
        setError("결과를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, [resultId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F4]">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B3D] border-t-transparent mx-auto"></div>
            <p className="text-gray-600">결과를 분석하고 있습니다...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen bg-[#FFF8F4]">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-red-600">
              {error || "결과를 찾을 수 없습니다."}
            </p>
            <button
              onClick={() => router.push("/leveltest")}
              className="rounded-lg bg-[#FF6B3D] px-6 py-2 text-white"
            >
              돌아가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const categoryData = [
    { name: "Vocabulary", score: result.vocabScore },
    { name: "Grammar", score: result.grammarScore },
    { name: "Writing", score: result.writingScore },
  ];

  const getMotivationalMessage = (percentile: number) => {
    if (percentile >= 90)
      return "🔥 Amazing! You're in the top 10%! Keep going!";
    if (percentile >= 70) return "💪 Great job! You're in the top 30%!";
    if (percentile >= 50) return "👍 Good work! You're above average!";
    if (percentile >= 30) return "📈 Keep practicing! You're making progress!";
    return "🌱 Every expert was once a beginner. Keep going!";
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Beginner: "text-blue-600",
      Elementary: "text-green-600",
      Intermediate: "text-orange-600",
      Advanced: "text-purple-600",
    };
    return colors[level] || "text-gray-600";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F4] to-white">
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            ✅ Test Complete!
          </h1>
          <p
            className={`text-2xl font-semibold ${getLevelColor(
              result.overallLevel
            )}`}
          >
            Your English Level: {result.overallLevel}
          </p>
          <p className="mt-2 text-lg text-gray-600">
            {getMotivationalMessage(result.percentile)}
          </p>
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            📊 Result Summary
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">Vocabulary</p>
              <p className="text-3xl font-bold text-[#FF6B3D]">
                {result.vocabScore}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Grammar</p>
              <p className="text-3xl font-bold text-[#FF6B3D]">
                {result.grammarScore}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Writing</p>
              <p className="text-3xl font-bold text-[#FF6B3D]">
                {result.writingScore}%
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-4xl font-bold text-gray-900">
                  {result.totalScore}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Average Speed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.avgSpeed.toFixed(1)}s
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Scores Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Category Scores
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#FF6B3D" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Percentile Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            📈 Global Ranking
          </h2>
          <div className="text-center">
            <p className="mb-4 text-5xl font-bold text-[#FF6B3D]">
              Top {100 - result.percentile}%
            </p>
            <p className="text-lg text-gray-600">
              You scored higher than {result.percentile}% of all ENGZ learners
            </p>
            <div className="mt-6">
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full bg-[#FF6B3D]"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - result.percentile}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            💬 AI Feedback
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-700">Strengths:</p>
              <p className="text-gray-600">{result.strengths}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Areas to Improve:</p>
              <p className="text-gray-600">{result.weaknesses}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                Recommended Routine:
              </p>
              <p className="text-gray-600">{result.recommendedRoutine}</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-[#FF6B3D] px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#FF6B3D]/90"
          >
            👉 Start Your Personalized AI Routine →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function QuickTestResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FFF8F4]">
          <NavBar />
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B3D] border-t-transparent mx-auto"></div>
              <p className="text-gray-600">결과를 불러오는 중...</p>
            </div>
          </div>
        </main>
      }
    >
      <QuickTestResultContent />
    </Suspense>
  );
}
