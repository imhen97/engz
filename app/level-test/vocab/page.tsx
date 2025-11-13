"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import ProgressBar from "@/components/level-test/ProgressBar";
import CountdownTimer from "@/components/level-test/CountdownTimer";

interface VocabQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function VocabTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timings, setTimings] = useState<number[]>([]); // Track response times
  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    // Load test data from sessionStorage
    const testData = sessionStorage.getItem("levelTestData");
    if (!testData) {
      router.push("/level-test/start");
      return;
    }

    const data = JSON.parse(testData);
    setQuestions(data.vocabQuestions || []);
    setAnswers(new Array(data.vocabQuestions?.length || 0).fill(-1));
    setTimings(new Array(data.vocabQuestions?.length || 0).fill(0));
  }, [router]);

  // Reset timer when question changes
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentIndex]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered

    // Calculate response time
    const responseTime = (Date.now() - questionStartTime.current) / 1000;
    const newTimings = [...timings];
    newTimings[currentIndex] = responseTime;
    setTimings(newTimings);

    setSelectedAnswer(optionIndex);
    const correct = optionIndex === questions[currentIndex].correctAnswer;
    setIsCorrect(correct);

    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);

    // Show feedback
    setShowFeedback(true);

    // Move to next question after delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Save answers and timings, then move to grammar section
        const testData = JSON.parse(
          sessionStorage.getItem("levelTestData") || "{}"
        );
        testData.vocabAnswers = newAnswers;
        testData.vocabTimings = newTimings;
        sessionStorage.setItem("levelTestData", JSON.stringify(testData));
        router.push("/level-test/grammar");
      }
    }, 1500);
  };

  const handleTimeout = () => {
    if (selectedAnswer !== null) return; // Already answered

    // Record timeout as 10 seconds
    const newTimings = [...timings];
    newTimings[currentIndex] = 10;
    setTimings(newTimings);

    // Auto-select first option (or skip)
    const newAnswers = [...answers];
    newAnswers[currentIndex] = -1; // Mark as skipped
    setAnswers(newAnswers);

    // Move to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        const testData = JSON.parse(
          sessionStorage.getItem("levelTestData") || "{}"
        );
        testData.vocabAnswers = newAnswers;
        testData.vocabTimings = newTimings;
        sessionStorage.setItem("levelTestData", JSON.stringify(testData));
        router.push("/level-test/grammar");
      }
    }, 500);
  };

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-[#FFF8F4] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-3xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
            section="Vocabulary"
          />
          <div className="ml-4">
            <CountdownTimer initialSeconds={10} onTimeout={handleTimeout} />
          </div>
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg sm:rounded-3xl sm:p-10"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6B3D]/70">
              Question {currentIndex + 1} / {questions.length}
            </p>
            <h2 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;
              const showResult = showFeedback && isSelected;

              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    showResult
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-[#F5472C] bg-[#FFF7F0]"
                      : "border-gray-200 bg-white hover:border-[#F5472C] hover:bg-[#FFF7F0]"
                  } ${
                    selectedAnswer !== null
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        showResult
                          ? isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(97 + index)}
                    </span>
                    <span className="flex-1 text-sm text-gray-900 sm:text-base">
                      {option}
                    </span>
                    {showResult && isCorrectAnswer && (
                      <span className="text-green-600">✓</span>
                    )}
                    {showResult && !isCorrect && isSelected && (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-6 rounded-lg p-4 ${
                  isCorrect
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="text-sm font-semibold">
                  {isCorrect
                    ? "✅ Correct!"
                    : "❌ Incorrect. The correct answer is highlighted."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
