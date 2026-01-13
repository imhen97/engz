"use client";

import { useState, useRef, useEffect } from "react";

interface Mission {
  id: string;
  week: number;
  day: number;
  content: string;
  aiFeedback?: string | null;
  completed: boolean;
}

interface MissionPracticeModalProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (missionId: string, response: string, score: number) => void;
}

export default function MissionPracticeModal({
  mission,
  isOpen,
  onClose,
  onComplete,
}: MissionPracticeModalProps) {
  const [mode, setMode] = useState<"text" | "recording">("text");
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    grammar: string;
    pronunciation: string;
    fluency: string;
    corrections: string[];
    suggestions: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTextInput("");
      setAudioBlob(null);
      setFeedback(null);
      setAttempts(0);
      setMode("text");
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("마이크 접근 오류:", error);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitResponse = async () => {
    if (!textInput.trim() && !audioBlob) {
      alert("답변을 입력하거나 녹음해주세요.");
      return;
    }

    setIsSubmitting(true);
    setAttempts((prev) => prev + 1);

    try {
      const formData = new FormData();
      formData.append("missionId", mission.id);
      formData.append("mode", mode);
      
      if (mode === "text") {
        formData.append("text", textInput);
      } else if (audioBlob) {
        formData.append("audio", audioBlob, "recording.webm");
      }

      const response = await fetch("/api/missions/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("제출 실패");
      }

      const data = await response.json();
      
      setFeedback({
        score: data.score,
        grammar: data.grammarGrade,
        pronunciation: data.pronunciationGrade,
        fluency: data.fluencyGrade,
        corrections: data.corrections || [],
        suggestions: data.suggestions,
      });

      // 90점 이상이면 완료 처리
      if (data.score >= 90) {
        onComplete(mission.id, textInput || "audio", data.score);
      }
    } catch (error) {
      console.error("제출 오류:", error);
      alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForRetry = () => {
    setTextInput("");
    setAudioBlob(null);
    setFeedback(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-medium text-[#F5472C]">
            {mission.week}주차 · {mission.day}일차
          </p>
          <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
            오늘의 미션
          </h2>
        </div>

        {/* Mission Content */}
        <div className="mb-6 rounded-xl bg-[#FFF7F0] p-4">
          <p className="text-sm font-medium text-gray-900">{mission.content}</p>
        </div>

        {/* Attempts Counter */}
        <div className="mb-4 text-center">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            시도 횟수: {attempts}회
          </span>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex justify-center gap-2">
          <button
            onClick={() => setMode("text")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "text"
                ? "bg-[#F5472C] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ✏️ 텍스트 입력
          </button>
          <button
            onClick={() => setMode("recording")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "recording"
                ? "bg-[#F5472C] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🎙️ 음성 녹음
          </button>
        </div>

        {/* Input Area */}
        {mode === "text" ? (
          <div className="mb-6">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="영어로 답변을 작성해주세요..."
              className="h-32 w-full resize-none rounded-xl border border-gray-200 p-4 text-sm focus:border-[#F5472C] focus:outline-none focus:ring-2 focus:ring-[#F5472C]/20"
              disabled={isSubmitting}
            />
          </div>
        ) : (
          <div className="mb-6 flex flex-col items-center gap-4">
            {!audioBlob ? (
              <>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex h-24 w-24 items-center justify-center rounded-full transition ${
                    isRecording
                      ? "animate-pulse bg-red-500 text-white"
                      : "bg-[#F5472C] text-white hover:bg-[#d93d25]"
                  }`}
                >
                  {isRecording ? (
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  )}
                </button>
                <p className="text-sm text-gray-500">
                  {isRecording ? "녹음 중... 클릭하여 중지" : "클릭하여 녹음 시작"}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <audio
                  src={URL.createObjectURL(audioBlob)}
                  controls
                  className="w-full max-w-sm"
                />
                <button
                  onClick={() => setAudioBlob(null)}
                  className="text-sm text-gray-500 hover:text-[#F5472C]"
                >
                  다시 녹음하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!feedback && (
          <button
            onClick={submitResponse}
            disabled={isSubmitting || (!textInput.trim() && !audioBlob)}
            className="mb-6 w-full rounded-full bg-[#F5472C] py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI 분석 중...
              </span>
            ) : (
              "🎯 제출하고 AI 피드백 받기"
            )}
          </button>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="space-y-4">
            {/* Score */}
            <div className="rounded-xl bg-gradient-to-r from-[#F5472C] to-[#ff6a3c] p-6 text-center text-white">
              <p className="text-sm opacity-90">총점</p>
              <p className="text-5xl font-bold">{feedback.score}</p>
              <p className="mt-2 text-sm">
                {feedback.score >= 90
                  ? "🎉 훌륭해요! 미션 완료!"
                  : feedback.score >= 70
                  ? "👍 좋아요! 조금만 더 연습해볼까요?"
                  : "💪 다시 도전해보세요!"}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                <p className="text-xs text-gray-500">문법</p>
                <p className="mt-1 text-lg font-bold text-[#F5472C]">{feedback.grammar}</p>
              </div>
              <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                <p className="text-xs text-gray-500">발음</p>
                <p className="mt-1 text-lg font-bold text-[#F5472C]">{feedback.pronunciation}</p>
              </div>
              <div className="rounded-lg bg-[#FFF7F0] p-3 text-center">
                <p className="text-xs text-gray-500">유창성</p>
                <p className="mt-1 text-lg font-bold text-[#F5472C]">{feedback.fluency}</p>
              </div>
            </div>

            {/* Corrections */}
            {feedback.corrections.length > 0 && (
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">📝 수정 제안</h4>
                <ul className="space-y-1">
                  {feedback.corrections.map((correction, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {correction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-900">💡 AI 코치의 조언</h4>
              <p className="text-sm text-gray-600">{feedback.suggestions}</p>
            </div>

            {/* Action Buttons */}
            {feedback.score < 90 ? (
              <button
                onClick={resetForRetry}
                className="w-full rounded-full bg-[#F5472C] py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                🔁 다시 도전하기
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full rounded-full bg-green-500 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                ✅ 미션 완료! 닫기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
