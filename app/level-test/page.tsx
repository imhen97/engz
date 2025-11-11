"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import NavBar from "@/components/NavBar";
import TestStep from "@/components/TestStep";
import FeedbackPreview from "@/components/FeedbackPreview";
import TrialModal from "@/components/TrialModal";

const quizQuestions = [
  {
    question: "Choose the correct sentence:",
    options: [
      "She don't like coffee.",
      "She doesn't likes coffee.",
      "She doesn't like coffee.",
      "She don't likes coffee.",
    ],
  },
  {
    question: "Pick the best phrasal verb for 'return':",
    options: ["look back", "go back", "turn with", "back turn"],
  },
  {
    question: "Which word fits? 'The report was ___ by Friday.'",
    options: ["due", "do", "done", "doing"],
  },
  {
    question: "Find the synonym for 'improve':",
    options: ["decline", "enhance", "ignore", "remove"],
  },
  {
    question: "Choose the correct idiom meaning 'to start again':",
    options: ["hit the sack", "take off", "start from scratch", "run out"],
  },
];

const purposes = ["회화 집중", "TOEIC 대비", "IELTS 대비", "비즈니스 영어"];

const totalInteractiveSteps = 4; // 정보, 퀴즈, 스피킹, 라이팅

export default function LevelTestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<(string | null)[]>(
    Array(quizQuestions.length).fill(null)
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [writing, setWriting] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [metrics, setMetrics] = useState<{
    fluency: number;
    accuracy: number;
    pronunciation: number;
    writing: number;
  } | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingURLRef = useRef<string | null>(null);

  const wizardRef = useRef<HTMLDivElement | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const progressPercent = useMemo(() => {
    if (currentStep >= totalInteractiveSteps) {
      return 100;
    }
    return Math.round((currentStep / totalInteractiveSteps) * 100);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 4) {
      setAnalysisProgress(15);
      const start = Date.now();
      const interval = window.setInterval(() => {
        setAnalysisProgress((prev) => Math.min(prev + 10, 95));
      }, 400);
      const timeout = window.setTimeout(() => {
        window.clearInterval(interval);
        setAnalysisProgress(100);
        setMetrics({
          fluency: 70 + Math.floor(Math.random() * 20),
          accuracy: 65 + Math.floor(Math.random() * 25),
          pronunciation: 68 + Math.floor(Math.random() * 22),
          writing: 60 + Math.floor(Math.random() * 25),
        });
        setCurrentStep(5);
      }, 3200);

      return () => {
        window.clearInterval(interval);
        window.clearTimeout(timeout);
      };
    }
    return undefined;
  }, [currentStep]);

  useEffect(
    () => () => {
      if (recordingURLRef.current) {
        URL.revokeObjectURL(recordingURLRef.current);
      }
    },
    []
  );

  const resetTest = () => {
    setCurrentStep(0);
    setPurpose(null);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setAudioUrl(null);
    setWriting("");
    setError(null);
    setAnalysisProgress(0);
    setMetrics(null);
  };

  const handleHeroStart = () => {
    resetTest();
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleViewSample = () => {
    setMetrics({ fluency: 86, accuracy: 82, pronunciation: 88, writing: 79 });
    setCurrentStep(5);
    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 0 && !purpose) {
      setError("목적을 선택해 주세요.");
      return;
    }
    if (currentStep === 1 && quizAnswers.some((answer) => !answer)) {
      setError("모든 문항을 선택해 주세요.");
      return;
    }
    if (currentStep === 2 && !audioUrl) {
      setError("녹음하거나 음성을 업로드해 주세요.");
      return;
    }
    if (currentStep === 3 && writing.trim().length < 40) {
      setError("짧은 단락(최소 40자 이상)을 작성해 주세요.");
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep === 0) return;
    if (currentStep === 5) {
      setCurrentStep(3);
      return;
    }
    setCurrentStep((prev) => prev - 1);
  };

  const handleQuizChange = (index: number, value: string) => {
    setQuizAnswers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        if (recordingURLRef.current) {
          URL.revokeObjectURL(recordingURLRef.current);
        }
        const url = URL.createObjectURL(blob);
        recordingURLRef.current = url;
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      setError("마이크 접근이 허용되지 않았습니다.");
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleUploadAudio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (recordingURLRef.current) {
      URL.revokeObjectURL(recordingURLRef.current);
    }
    const url = URL.createObjectURL(file);
    recordingURLRef.current = url;
    setAudioUrl(url);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TestStep>
            <h3 className="text-xl font-semibold text-gray-900">
              어떤 목표로 영어를 학습하고 계신가요?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              ENGZ AI가 목표에 맞춰 테스트 결과를 분석합니다.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {purposes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPurpose(item)}
                  className={`rounded-2xl border px-5 py-4 text-sm font-medium transition ${
                    purpose === item
                      ? "border-[#F5472C] bg-[#FFF0EC] text-[#F5472C]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#F5472C]/50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </TestStep>
        );
      case 1:
        return (
          <TestStep>
            <h3 className="text-xl font-semibold text-gray-900">
              5문항 퀴즈로 기초 실력을 진단해요
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              각 문항을 선택하면 자동으로 저장됩니다.
            </p>
            <div className="mt-6 space-y-6">
              {quizQuestions.map((item, index) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-gray-100 p-5"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {index + 1}. {item.question}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {item.options.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${
                          quizAnswers[index] === option
                            ? "border-[#F5472C] bg-[#FFF0EC] text-[#F5472C]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-[#F5472C]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${index}`}
                          value={option}
                          className="hidden"
                          checked={quizAnswers[index] === option}
                          onChange={() => handleQuizChange(index, option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TestStep>
        );
      case 2:
        return (
          <TestStep>
            <h3 className="text-xl font-semibold text-gray-900">
              음성으로 답변해 주세요
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              아래 질문에 대해 30초 동안 이야기해 보세요. 녹음이 어렵다면 음성
              파일을 업로드해도 좋습니다.
            </p>
            <div className="mt-6 space-y-4">
              <p className="rounded-2xl bg-[#FFF7F5] p-4 text-sm text-gray-700">
                🌎 질문: 최근에 영어를 사용해야 했던 상황을 설명해 주세요.
                무엇이 가장 어려웠고 어떻게 해결했나요?
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F5472C] px-5 py-2 text-sm font-semibold text-white shadow"
                  >
                    🎙️ 녹음 시작
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="inline-flex items-center gap-2 rounded-full border border-[#F5472C] px-5 py-2 text-sm font-semibold text-[#F5472C]"
                  >
                    ⏹️ 녹음 종료
                  </button>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-xs font-medium text-gray-500 hover:border-[#F5472C]/60">
                  📁 음성 업로드
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleUploadAudio}
                  />
                </label>
              </div>
              {audioUrl && (
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    녹음 미리 듣기
                  </p>
                  <audio controls className="mt-2 w-full">
                    <source src={audioUrl} type="audio/webm" />
                  </audio>
                </div>
              )}
            </div>
          </TestStep>
        );
      case 3:
        return (
          <TestStep>
            <h3 className="text-xl font-semibold text-gray-900">
              짧은 글을 작성해 주세요
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              최근 영어 학습 경험과 가장 도움이 되었던 방법을 3~4문장으로 작성해
              주세요.
            </p>
            <textarea
              value={writing}
              onChange={(event) => setWriting(event.target.value)}
              rows={6}
              className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-[#F5472C] focus:outline-none"
              placeholder="예: 4주 동안 매일 아침 20분씩 영어 일기를 작성했습니다..."
            />
            <p className="mt-2 text-xs text-gray-400">
              최소 40자 이상 작성해 주시면 AI 분석이 더 정확해집니다.
            </p>
          </TestStep>
        );
      case 4:
        return (
          <TestStep>
            <h3 className="text-xl font-semibold text-gray-900">
              AI가 결과를 분석 중입니다...
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              음성, 라이팅, 퀴즈 결과를 종합해 맞춤 리포트를 준비하고 있어요.
            </p>
            <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#F5472C] transition-all"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <motion.div
              className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-500"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <span>AI 음성 분석</span>
              <span>·</span>
              <span>문장 구조 평가</span>
              <span>·</span>
              <span>맞춤 루틴 설계</span>
            </motion.div>
          </TestStep>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-[Pretendard] overflow-x-hidden">
      <NavBar />

      <section className="relative flex min-h-[calc(100vh-120px)] items-center justify-center px-6 pt-32 pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#FFF5F3]" />
        <div className="max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#F5472C]">
            AI Level Test
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Discover Your Real English Level with AI
          </h1>
          <p className="mt-6 text-base text-gray-600 md:text-lg">
            Take our smart 5-minute test designed by ENGZ AI and see how your
            English actually sounds.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleHeroStart}
              className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              Start Free AI Level Test →
            </button>
            <button
              type="button"
              onClick={handleViewSample}
              className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-8 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
            >
              View Sample Feedback →
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            The AI feedback summary will be unlocked after the test — start your
            free 7-day trial to view details.
          </p>
        </div>
      </section>

      <section ref={wizardRef} className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">진행률</p>
              <p className="text-sm font-semibold text-[#F5472C]">
                {progressPercent}%
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#F5472C] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
              {error && <p className="mt-4 text-sm text-[#F5472C]">{error}</p>}
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50"
                disabled={currentStep === 0}
              >
                이전 단계
              </button>
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-6 py-2 text-xs font-semibold text-white hover:scale-[1.02]"
                >
                  다음 단계
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {metrics && (
        <div ref={feedbackRef}>
          <FeedbackPreview
            metrics={metrics}
            onStartTrial={() => setShowTrialModal(true)}
          />
        </div>
      )}

      <TrialModal
        open={showTrialModal}
        onClose={() => setShowTrialModal(false)}
      />

      <footer className="bg-gray-900 text-gray-400 text-center text-xs py-6">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
