"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function TrialModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const checkoutUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "#";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              7일 무료 체험을 시작하세요
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              카드 인증 후 바로 체험이 시작되며, 언제든지 체험 종료 전에
              취소하실 수 있습니다. 체험이 끝나면 자동으로 정기 구독이
              진행됩니다.
            </p>

            <div className="mt-6 space-y-3 text-left text-sm text-gray-500">
              <p>✅ AI 맞춤 리포트 전체 열람</p>
              <p>✅ 추천 코스 & 4주 학습 플랜</p>
              <p>✅ 음성·라이팅 상세 피드백</p>
            </div>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              Stripe 결제 페이지로 이동 →
            </a>
            <p className="mt-2 text-xs text-gray-400">
              체험 종료 전 언제든 취소 가능합니다.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              닫기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
