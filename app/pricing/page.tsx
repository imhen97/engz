"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navLinkClass = "hover:text-[#F5472C] transition-colors";

const monthlyCheckout = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL || "#";
const annualCheckout = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_URL || "#";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-black font-[Pretendard] overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <a
            href="/"
            className="text-xl font-bold text-[#F5472C] tracking-tight"
          >
            ENGZ
          </a>
          <nav className="space-x-8 text-sm font-medium text-gray-700">
            <a href="/#service" className={navLinkClass}>
              서비스
            </a>
            <a href="/#ceo" className={navLinkClass}>
              소개
            </a>
            <a href="/#pricing" className={navLinkClass}>
              구독 플랜
            </a>
            <a href="/ai-course" className={navLinkClass}>
              AI 집중코스
            </a>
            <a href="/level-test" className={navLinkClass}>
              AI 레벨 테스트
            </a>
            <a
              href="https://www.eng-z.com/pricing"
              className="text-[#F5472C] font-semibold"
            >
              구독 플랜
            </a>
            <a href="/coming-soon" className={navLinkClass}>
              AI 플랫폼
            </a>
            <a href="/testimonials" className={navLinkClass}>
              후기
            </a>
            <a href="/#contact" className={navLinkClass}>
              문의
            </a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[calc(100vh-120px)] items-center justify-center px-6 pt-32 pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#FFF7F5]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#F5472C]">
            Pricing
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Choose Your Plan — Start Learning with ENGZ AI
          </h1>
          <p className="mt-6 text-base text-gray-600 md:text-lg">
            목표에 맞춰 성장하는 유연한 플랜을 선택하세요. 언제든지 취소할 수 있습니다.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            7일 무료 체험으로 지금 시작해 보세요. 체험 종료 전 언제든지 취소하면 비용이 청구되지 않습니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={monthlyCheckout}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              7일 무료 체험 시작하기 →
            </a>
            <Link
              href="/level-test"
              className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-8 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
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
        className="bg-white px-6 pb-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#F5472C]/30 bg-[#FFF5F3] p-8 shadow-lg">
              <p className="text-sm uppercase tracking-[0.25em] text-[#F5472C]">
                Most Popular
              </p>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Monthly Plan
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                1,200명 이상의 학습자가 ENGZ AI로 실력을 높이고 있습니다.
              </p>
              <p className="mt-6 text-3xl font-bold text-[#F5472C]">
                ₩49,000
                <span className="text-base font-medium text-gray-500">
                  {" "}
                  / month
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

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900">Annual Plan</h2>
              <p className="mt-2 text-sm text-gray-500">
                1년 단위로 결제하면 월간 요금 대비 약 2개월을 절약할 수 있습니다.
              </p>
              <p className="mt-6 text-3xl font-bold text-[#F5472C]">
                ₩490,000
                <span className="text-base font-medium text-gray-500">
                  {" "}
                  / year
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>• Monthly Plan의 모든 혜택 포함</li>
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

          <div className="mt-16 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow">
            <p className="text-sm text-gray-600">
              결제를 완료하면 자동으로 코스 대시보드로 이동하여 모든 ENGZ AI 학습 도구를 즉시 이용할 수 있습니다.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-xs text-gray-400 sm:flex-row">
              <span>• Stripe Checkout으로 안전하게 결제</span>
              <span>• 체험 기간 중 언제든 무료 취소 가능</span>
              <span>
                • 도움이 필요하시면{" "}
                <Link href="/level-test" className="text-[#F5472C]">
                  ENGZ 팀에 문의하세요
                </Link>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      <footer className="bg-gray-900 text-gray-400 text-center text-xs py-6">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
