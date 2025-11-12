"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import ProgressBar from "@/components/level-test/ProgressBar";

interface WritingPrompt {
  id: string;
  prompt: string;
  example?: string;
}

export default function WritingTestPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const testData = sessionStorage.getItem("levelTestData");
    if (!testData) {
      router.push("/level-test/start");
      return;
    }

    const data = JSON.parse(testData);
    setPrompts(data.writingPrompts || []);
    setAnswers(new Array(data.writingPrompts?.length || 0).fill(""));
  }, [router]);

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentAnswer;
    setAnswers(newAnswers);

    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(answers[currentIndex + 1] || "");
    } else {
      // All prompts answered, submit for AI grading
      handleSubmit([...newAnswers, currentAnswer]);
    }
  };

  const handleSubmit = async (finalAnswers: string[]) => {
    setLoading(true);

    try {
      // Grade writing answers via OpenAI
      const response = await fetch("/api/leveltest/grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompts: prompts.map((p, i) => ({
            prompt: p.prompt,
            answer: finalAnswers[i],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to grade writing");
      }

      const writingScores = await response.json();

      // Calculate all scores and submit
      const testData = JSON.parse(sessionStorage.getItem("levelTestData") || "{}");
      const vocabScore = calculateScore(testData.vocabAnswers, testData.vocabQuestions);
      const grammarScore = calculateScore(testData.grammarAnswers, testData.grammarQuestions);
      const avgWritingScore = Math.round(
        writingScores.scores.reduce((sum: number, s: number) => sum + s, 0) /
          writingScores.scores.length
      );

      // Submit final results
      const submitResponse = await fetch("/api/leveltest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: testData.level,
          vocabScore,
          grammarScore,
          writingScore: avgWritingScore,
          vocabAnswers: testData.vocabAnswers,
          grammarAnswers: testData.grammarAnswers,
          writingAnswers: finalAnswers,
        }),
      });

      if (!submitResponse.ok) {
        throw new Error("Failed to submit results");
      }

      const result = await submitResponse.json();
      
      // Store result ID and data for result page
      sessionStorage.setItem("levelTestResultId", result.id);
      sessionStorage.setItem("levelTestSubmitData", JSON.stringify(result));
      router.push("/level-test/result");
    } catch (error) {
      console.error("제출 실패:", error);
      setLoading(false);
    }
  };

  const calculateScore = (answers: (number | string)[], questions: any[]) => {
    if (!answers || !questions) return 0;
    let correct = 0;
    answers.forEach((answer, index) => {
      if (questions[index] && answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (prompts.length === 0) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  const currentPrompt = prompts[currentIndex];
  const canProceed = currentAnswer.trim().length >= 10;

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-3xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <ProgressBar
          current={currentIndex + 1}
          total={prompts.length}
          section="Writing"
        />

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg sm:rounded-3xl sm:p-10"
        >
          <div className="mb-6">
            <p className="text-sm font-medium text-[#F5472C]">
              ✍️ Question {currentIndex + 1} / {prompts.length}
            </p>
            <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
              {currentPrompt.prompt}
            </h2>
            {currentPrompt.example && (
              <p className="mt-3 text-sm text-gray-600 italic">
                Example: {currentPrompt.example}
              </p>
            )}
          </div>

          <div className="mb-6">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="min-h-[200px] w-full rounded-xl border-2 border-gray-200 p-4 text-sm focus:border-[#F5472C] focus:outline-none focus:ring-2 focus:ring-[#F5472C] sm:min-h-[250px] sm:text-base"
              disabled={loading}
            />
            <p className="mt-2 text-xs text-gray-500">
              {currentAnswer.length} characters (minimum 10 required)
            </p>
          </div>

          <div className="flex justify-between">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentIndex] = currentAnswer;
                  setAnswers(newAnswers);
                  setCurrentIndex(currentIndex - 1);
                  setCurrentAnswer(answers[currentIndex - 1] || "");
                }}
                disabled={loading}
                className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C] disabled:opacity-50"
              >
                ← Previous
              </button>
            )}
            <div className="ml-auto" />
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Grading...
                </span>
              ) : currentIndex < prompts.length - 1 ? (
                "Next →"
              ) : (
                "Submit & View Results →"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

