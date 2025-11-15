"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/level-test/QuestionCard";
import ProgressBar from "@/components/level-test/ProgressBar";
import NavBar from "@/components/NavBar";

type Question = {
  id: string;
  type: "vocabulary" | "grammar" | "writing";
  question: string;
  options?: string[];
  correctAnswer?: number;
  correctAnswerText?: string;
  questionNumber: number;
};

type Answer = {
  questionId: string;
  answer: string | number;
  responseTime: number;
  correct: boolean;
};

export default function QuickTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch questions
    fetch("/api/leveltest/questions")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        setError("질문을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, []);

  const handleAnswer = (answer: string | number, responseTime: number) => {
    const currentQuestion = questions[currentIndex];
    let correct = false;

    if (currentQuestion.type === "writing") {
      // For writing, we'll check on the server
      correct = false; // Will be evaluated on submit
    } else {
      correct = answer === currentQuestion.correctAnswer;
    }

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer,
      responseTime,
      correct,
    };

    setAnswers([...answers, newAnswer]);

    // Move to next question or submit
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 500);
    } else {
      // Submit test
      submitTest([...answers, newAnswer]);
    }
  };

  const handleTimeout = () => {
    const currentQuestion = questions[currentIndex];
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: currentQuestion.type === "writing" ? "" : -1,
      responseTime: 5.0,
      correct: false,
    };

    setAnswers([...answers, newAnswer]);

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 500);
    } else {
      submitTest([...answers, newAnswer]);
    }
  };

  const submitTest = async (finalAnswers: Answer[]) => {
    try {
      const response = await fetch("/api/leveltest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          answers: finalAnswers,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to result page
      router.push(`/leveltest/result?id=${data.resultId}`);
    } catch (err) {
      console.error("Failed to submit test:", err);
      setError("테스트 제출 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F4]">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B3D] border-t-transparent mx-auto"></div>
            <p className="text-gray-600">질문을 준비하고 있습니다...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FFF8F4]">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-red-600">{error}</p>
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

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-[#FFF8F4]">
      <NavBar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestion.questionNumber}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onTimeout={handleTimeout}
            />
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
