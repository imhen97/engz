import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "ENGZ 후기 모음 | 수강생 성공 이야기",
  description:
    "ENGZ의 프리미엄 1:1 영어 코칭을 경험한 수강생들의 실제 후기를 확인하세요. 지속 가능한 성장과 목표 달성 이야기를 만나보세요.",
};

export default function TestimonialsPage() {
  try {
    return (
      <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] text-black">
        <NavBar />

        <section className="px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C]">
              성공 후기
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
              ENGZ 수강생이 증명한 성장 이야기
            </h1>
            <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:mt-6 sm:text-sm md:text-base">
              ENGZ 코칭을 통해 영어 실력을 바꾼 직장인, 학생, 리더들의 실제 경험을
              만나보세요.
            </p>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 sm:pb-16 md:px-8 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-5xl">
            <TestimonialCarousel testimonials={testimonials} />
          </div>

          <div className="mx-auto mt-10 max-w-5xl text-center sm:mt-12 md:mt-16">
            <a
              href="https://www.eng-z.com/pricing"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#F5472C] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:scale-105 sm:max-w-none sm:w-auto sm:px-8 sm:py-3 sm:text-sm"
            >
              나도 수업 받으러 가기 →
            </a>
          </div>
        </section>

        <footer className="bg-gray-900 py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} ENGZ. All rights reserved.
        </footer>
      </main>
    );
  } catch (error) {
    console.error("Testimonials page error:", error);
    // Return a fallback UI instead of crashing
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">페이지를 불러올 수 없습니다</p>
          <a href="/" className="text-[#F5472C] hover:underline">홈으로 돌아가기</a>
        </div>
      </div>
    );
  }
}
