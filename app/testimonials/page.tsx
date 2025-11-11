import type { Metadata } from "next";

import TestimonialCarousel from "@/components/TestimonialCarousel";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "ENGZ 후기 모음 | 수강생 성공 이야기",
  description:
    "ENGZ의 프리미엄 1:1 영어 코칭을 경험한 수강생들의 실제 후기를 확인하세요. 지속 가능한 성장과 목표 달성 이야기를 만나보세요.",
};

export default function TestimonialsPage() {
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
            <a
              href="/#service"
              className="hover:text-[#F5472C] transition-colors"
            >
              서비스
            </a>
            <a href="/#ceo" className="hover:text-[#F5472C] transition-colors">
              소개
            </a>
            <a
              href="/#pricing"
              className="hover:text-[#F5472C] transition-colors"
            >
              요금제
            </a>
            <a href="/coming-soon" className="hover:text-[#F5472C] transition-colors">
              AI 플랫폼
            </a>
            <a href="/testimonials" className="text-[#F5472C] font-semibold">
              후기
            </a>
            <a
              href="/#contact"
              className="hover:text-[#F5472C] transition-colors"
            >
              문의
            </a>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#F5472C]">
            Success Stories
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            ENGZ 수강생의 진짜 성장 후기
          </h1>
          <p className="mt-6 text-base text-gray-600 leading-relaxed">
            프리미엄 1:1 영어 코칭으로 목표를 달성한 수강생들의 생생한 후기와
            해나쌤의 맞춤 피드백을 확인해보세요. 실제 변화와 성장의 순간들이
            담겨 있습니다.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-center text-xs py-6">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
