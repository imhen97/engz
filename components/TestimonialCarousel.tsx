"use client";

import { useEffect, useMemo, useState } from "react";

import TestimonialCard from "./TestimonialCard";
import { Testimonial } from "@/data/testimonials";

const AUTO_CHANGE_INTERVAL = 6000;

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const items = useMemo(() => testimonials ?? [], [testimonials]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, AUTO_CHANGE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [items.length]);

  const handleNavigate = (nextIndex: number) => {
    if (items.length === 0) return;
    const safeIndex = (nextIndex + items.length) % items.length;
    setActiveIndex(safeIndex);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-md">
        아직 등록된 후기가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative min-h-[520px] w-full overflow-hidden">
        {items.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === activeIndex
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => handleNavigate(activeIndex - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-500 shadow-sm transition hover:border-[#F5472C] hover:text-[#F5472C]"
            aria-label="이전 후기"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleNavigate(activeIndex + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 text-gray-500 shadow-sm transition hover:border-[#F5472C] hover:text-[#F5472C]"
            aria-label="다음 후기"
          >
            →
          </button>
        </>
      )}

      {items.length > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {items.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? "bg-[#F5472C]" : "bg-gray-300"
              }`}
              onClick={() => handleNavigate(index)}
              aria-label={`후기 ${index + 1} 보기`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
