"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

export default function QuickLevelTestPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/leveltest/test");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F4] to-white">
      <NavBar />
      <div className="mx-auto max-w-4xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            🧠 현재 내 진짜 영어 실력은
            <br />
            어느 정도 수준일까?
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            AI가 당신의 어휘, 문법, 작문 능력을 분석하고
            <br />전 세계 사용자 중 어디에 위치해 있는지 알려드립니다.
          </p>
          <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              ⚡ 5초 AI 영어 레벨 테스트
            </h2>
            <ul className="space-y-2 text-left text-gray-600">
              <li>✅ 총 10문제 (약 60초 소요)</li>
              <li>✅ 어휘 4문제 + 문법 4문제 + 작문 2문제</li>
              <li>✅ 각 문제당 5초 제한</li>
              <li>✅ 즉시 결과 확인 및 전 세계 순위 확인</li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="rounded-full bg-[#FF6B3D] px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-[#FF6B3D]/90"
          >
            🟠 지금 바로 테스트 해보기
          </motion.button>
          <p className="mt-6 text-sm text-gray-500">
            로그인 없이도 테스트 가능합니다
          </p>
        </motion.div>
      </div>
    </main>
  );
}
