"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

const monthlyCheckout = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL || "#";
const annualCheckout = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_URL || "#";

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] text-black">
      <NavBar />

      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 pt-28 pb-20 text-center sm:pt-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#FFF7F5]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#F5472C] sm:text-sm">
            요금제 안내
          </p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            ENGZ AI와 함께할 요금제를 선택해 보세요
          </h1>
          <p className="mt-6 text-sm text-gray-600 sm:text-base md:text-lg">
            목표에 맞춰 성장하는 유연한 플랜을 선택하세요. 언제든지 취소할 수
            있습니다.
          </p>
          <p className="mt-4 text-xs text-gray-500 sm:text-sm">
            7일 무료 체험으로 지금 시작해 보세요. 체험 종료 전 언제든지 취소하면
            비용이 청구되지 않습니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={monthlyCheckout}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:w-auto sm:px-8"
            >
              7일 무료 체험 시작하기 →
            </a>
            <Link
              href="/level-test"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:w-auto sm:px-8"
            >
              AI 레벨 테스트 먼저 보기 →
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 pb-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:grid md:grid-cols-2">
          <div className="rounded-3xl border border-[#F5472C]/30 bg-[#FFF5F3] p-6 shadow-lg sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#F5472C] sm:text-sm">
              가장 많이 선택한 플랜
            </p>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              월간 플랜
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              1,200명 이상의 학습자가 ENGZ AI로 실력을 높이고 있습니다.
            </p>
            <p className="mt-6 text-3xl font-bold text-[#F5472C]">
              ₩49,000
              <span className="text-base font-medium text-gray-500">
                {" "}
                / 월
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>
                • AI 코스 전체 이용 (슬랭, 팝가사, IELTS, 비즈니스, 스몰토크)
              </li>
              <li>• 주간 AI 피드백 리포트 제공</li>
              <li>• 언제든지 취소 가능</li>
            </ul>
            <a
              href={monthlyCheckout}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              월간 플랜 시작하기 →
            </a>
            <p className="mt-2 text-xs text-gray-400">
              체험은 7일 동안 무료이며 종료 전 언제든 해지 가능합니다.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">연간 플랜</h2>
            <p className="mt-2 text-sm text-gray-500">
              1년 단위로 결제하면 월간 요금 대비 약 2개월을 절약할 수 있습니다.
            </p>
            <p className="mt-6 text-3xl font-bold text-[#F5472C]">
              ₩39,000
              <span className="text-base font-medium text-gray-500">
                {" "}
                / 월
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li>• 월간 플랜의 모든 혜택 포함</li>
              <li>• 우선 순위 AI 지원</li>
              <li>• 신규 기능 베타 프로그램 우선 참여</li>
            </ul>
            <a
              href={annualCheckout}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
            >
              연간 플랜 시작하기 →
            </a>
            <p className="mt-2 text-xs text-gray-400">
              7일 무료 체험 후 청구가 시작되며 언제든 취소할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl rounded-3xl border border-gray-100 bg-white p-6 text-center shadow sm:p-8">
          <p className="text-sm text-gray-600">
            결제를 완료하면 자동으로 코스 대시보드로 이동하여 모든 ENGZ AI 학습
            도구를 즉시 이용할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs text-gray-400 sm:flex-row sm:gap-4">
            <span>• Stripe 결제로 안전하게 결제</span>
            <span>• 체험 기간 중 언제든 무료 취소 가능</span>
            <span>
              • 도움이 필요하시면{" "}
              <Link href="/level-test" className="text-[#F5472C]">
                ENGZ 팀에 문의하세요
              </Link>
            </span>
          </div>
        </div>
      </motion.section>

      <footer className="bg-gray-900 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
