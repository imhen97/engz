"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import TestimonialCard from "./TestimonialCard";
import { Testimonial } from "@/data/testimonials";

const AUTO_CHANGE_INTERVAL = 6000;

const slideVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const items = useMemo(() => testimonials ?? [], [testimonials]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const determineItemsPerSlide = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerSlide(1);
      } else if (width < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    determineItemsPerSlide();
    window.addEventListener("resize", determineItemsPerSlide);
    return () => window.removeEventListener("resize", determineItemsPerSlide);
  }, []);

  const slides = useMemo(() => {
    if (items.length === 0) return [];
    const chunked: Testimonial[][] = [];
    for (let i = 0; i < items.length; i += itemsPerSlide) {
      chunked.push(items.slice(i, i + itemsPerSlide));
    }
    return chunked;
  }, [items, itemsPerSlide]);

  useEffect(() => {
    setActiveIndex(0);
  }, [itemsPerSlide]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_CHANGE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const handleNavigate = (nextIndex: number) => {
    if (slides.length === 0) return;
    const safeIndex = (nextIndex + slides.length) % slides.length;
    setActiveIndex(safeIndex);
  };

  if (slides.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-md">
        아직 등록된 후기가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative min-h-[360px] w-full overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {slides.map(
            (slide, index) =>
              index === activeIndex && (
                <motion.div
                  key={slide[0]?.id ?? index}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div
                    className="grid h-full gap-6"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(
                        3,
                        slide.length
                      )}, minmax(0, 1fr))`,
                    }}
                  >
                    {slide.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                      />
                    ))}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => handleNavigate(activeIndex - 1)}
            className="pointer-events-auto rounded-full border border-gray-200 bg-white p-3 text-gray-500 shadow-sm transition hover:border-[#F5472C] hover:text-[#F5472C]"
            aria-label="이전 후기"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleNavigate(activeIndex + 1)}
            className="pointer-events-auto rounded-full border border-gray-200 bg-white p-3 text-gray-500 shadow-sm transition hover:border-[#F5472C] hover:text-[#F5472C]"
            aria-label="다음 후기"
          >
            →
          </button>
        </div>
      )}

      {slides.length > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`h-2.5 w-6 rounded-full transition-all duration-300 ${
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
