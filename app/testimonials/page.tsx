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
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] text-black">
      <NavBar />

      <section className="px-6 pt-28 pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C]">
            성공 후기
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            ENGZ 수강생이 증명한 성장 이야기
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-gray-600 md:text-base">
            ENGZ 코칭을 통해 영어 실력을 바꾼 직장인, 학생, 리더들의 실제 경험을 만나보세요.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <TestimonialCarousel testimonials={testimonials} />
        </div>

        <div className="mx-auto mt-16 max-w-5xl text-center">
          <a
            href="https://www.eng-z.com/pricing"
            className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
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
}
