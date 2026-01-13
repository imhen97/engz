"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Timer from "./Timer";
import type { Question, TestAnswer } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string | number, responseTime: number) => void;
  onTimeout: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTimeout,
}: QuestionCardProps) {
  const handleAnswer = (answer: string | number, startTime: number): void => {
    const responseTime = (Date.now() - startTime) / 1000;
    onAnswer(answer, responseTime);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const textarea = document.querySelector("textarea");
    handleAnswer(textarea?.value || "", startTime);
  };

  const [startTime] = useState<number>(Date.now());

  if (question.type === "writing") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-[#FF6B3D]">
              Writing Question
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {question.question}
            </h2>
          </div>
          <Timer duration={5} onComplete={onTimeout} />
        </div>

        <div className="space-y-4">
          <textarea
            className="w-full rounded-lg border border-gray-300 p-4 text-lg focus:border-[#FF6B3D] focus:outline-none focus:ring-2 focus:ring-[#FF6B3D]/20"
            rows={4}
            placeholder="Type your answer in English..."
            autoFocus
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full rounded-lg bg-[#FF6B3D] px-6 py-3 font-medium text-white transition-colors hover:bg-[#FF6B3D]/90"
          >
            Submit Answer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-[#FF6B3D]">
            {question.type === "vocabulary" ? "Vocabulary" : "Grammar"} Question
          </span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {question.question}
          </h2>
        </div>
        <Timer duration={5} onComplete={onTimeout} />
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleAnswer(index, startTime);
            }}
            className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-[#FF6B3D] hover:bg-[#FFF8F4] focus:outline-none focus:ring-2 focus:ring-[#FF6B3D]/20"
          >
            <span className="font-medium text-gray-900">{option}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
