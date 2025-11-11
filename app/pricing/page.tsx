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
              요금제
            </a>
            <a href="/ai-course" className={navLinkClass}>
              AI 집중코스
            </a>
            <a href="/level-test" className={navLinkClass}>
              AI 레벨 테스트
            </a>
            <a href="/pricing" className="text-[#F5472C] font-semibold">
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
            Flexible plans that grow with your English goals. Cancel anytime.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Start today with a 7-day free trial. Cancel anytime before the trial
            ends to avoid charges.
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
                Join 1,200+ learners improving with ENGZ AI.
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
                Start Monthly Plan →
              </a>
              <p className="mt-2 text-xs text-gray-400">
                체험은 7일 동안 무료이며 종료 전 언제든 해지 가능합니다.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900">Annual Plan</h2>
              <p className="mt-2 text-sm text-gray-500">
                Pay yearly and save 2 months compared to monthly billing.
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
                Start Annual Plan →
              </a>
              <p className="mt-2 text-xs text-gray-400">
                7일 무료 체험 후 청구가 시작되며 언제든 취소할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow">
            <p className="text-sm text-gray-600">
              결제가 완료되면 자동으로 코스 대시보드로 이동하여 모든 ENGZ AI 학습 도구에 접근할 수 있습니다.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-xs text-gray-400 sm:flex-row">
              <span>• Stripe Checkout를 통한 안전한 결제</span>
              <span>• 체험 중 언제든 취소 가능</span>
              <span>
                • 지원이 필요하면{" "}
                <Link href="/level-test" className="text-[#F5472C]">
                  ENGZ 팀에 문의
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
