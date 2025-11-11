"use client";

import { motion } from "framer-motion";

type FeedbackMetrics = {
  fluency: number;
  accuracy: number;
  pronunciation: number;
  writing: number;
};

export default function FeedbackPreview({
  metrics,
  onStartTrial,
}: {
  metrics: FeedbackMetrics;
  onStartTrial: () => void;
}) {
  const metricList = [
    { label: "유창성", value: metrics.fluency },
    { label: "정확도", value: metrics.accuracy },
    { label: "발음", value: metrics.pronunciation },
    { label: "라이팅", value: metrics.writing },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FFF7F5] px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          AI가 분석한 당신의 영어 스냅샷
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          주요 지표만 미리 확인하고, 상세 리포트와 맞춤 플랜은 7일 무료 체험으로 열어보세요.
        </p>

        <div className="relative mt-10 rounded-3xl border border-[#F5472C]/30 bg-white p-8 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2">
            {metricList.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-600">{metric.label}</p>
                <p className="mt-3 text-2xl font-bold text-[#F5472C]">{metric.value}%</p>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                🔒 전체 AI 리포트 + 맞춤 루틴은 무료 체험 시작 후 확인 가능합니다.
              </p>
              <button
                type="button"
                onClick={onStartTrial}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                Start Free 7-Day Trial →
              </button>
              <p className="mt-2 text-xs text-gray-500">
                체험은 바로 시작되며 언제든 해지 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
