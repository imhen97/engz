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
          <p className="text-sm uppercase tracking-[0.3em] text-[#F5472C]">
            Success Stories
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            ENGZ 수강생의 진짜 성장 후기
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-gray-600 md:text-base">
            프리미엄 1:1 영어 코칭으로 목표를 달성한 수강생들의 생생한 후기와
            해나쌤의 맞춤 피드백을 확인해보세요. 실제 변화와 성장의 순간들이
            담겨 있습니다.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      <footer className="bg-gray-900 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
