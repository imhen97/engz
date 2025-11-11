import type { Metadata } from "next";

import ComingSoonHero from "@/components/ComingSoonHero";

export const metadata: Metadata = {
  title: "Engz AI – Coming Soon | Smart English Learning Platform",
  description:
    "ENGZ AI English Learning Platform is arriving soon. Experience smart, personalized English learning powered by AI and stay tuned for early access.",
};

const navLinkClass = "hover:text-[#F5472C] transition-colors";

export default function ComingSoonPage() {
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
            <a href="https://www.eng-z.com/pricing" className={navLinkClass}>
              구독 플랜
            </a>
            <a href="/ai-course" className={navLinkClass}>
              AI 집중코스
            </a>
            <a href="/level-test" className={navLinkClass}>
              AI 레벨 테스트
            </a>
            <a href="/testimonials" className={navLinkClass}>
              후기
            </a>
            <a href="/coming-soon" className="text-[#F5472C] font-semibold">
              AI 플랫폼
            </a>
            <a href="/#contact" className={navLinkClass}>
              문의
            </a>
          </nav>
        </div>
      </header>

      <ComingSoonHero />

      <footer className="bg-gray-900 text-gray-400 text-center text-xs py-6">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
