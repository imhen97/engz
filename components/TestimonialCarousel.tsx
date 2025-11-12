"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import TestimonialCard from "./TestimonialCard";
import { Testimonial } from "@/data/testimonials";

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollability);
    window.addEventListener("resize", checkScrollability);

    return () => {
      container.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [testimonials]);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;
    let cardWidth = 350; // mobile default
    if (containerWidth >= 1024) {
      cardWidth = 450; // desktop
    } else if (containerWidth >= 640) {
      cardWidth = 450; // tablet
    }
    const gap = 24;
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const scrollLeft = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const scrollRight = () => {
    if (activeIndex < testimonials.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  // Handle scroll to update active index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerWidth = container.clientWidth;
      let cardWidth = 350; // mobile default
      if (containerWidth >= 1024) {
        cardWidth = 450; // desktop
      } else if (containerWidth >= 640) {
        cardWidth = 450; // tablet
      }
      const gap = 24;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(newIndex, testimonials.length - 1));
      checkScrollability();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [testimonials.length]);

  // Handle mouse wheel for horizontal scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  if (testimonials.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-md">
        아직 등록된 후기가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {testimonials.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2 sm:px-4">
          <button
            type="button"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-500 shadow-md transition-all hover:border-[#F5472C] hover:text-[#F5472C] disabled:opacity-30 disabled:cursor-not-allowed sm:h-12 sm:w-12`}
            aria-label="이전 후기"
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-500 shadow-md transition-all hover:border-[#F5472C] hover:text-[#F5472C] disabled:opacity-30 disabled:cursor-not-allowed sm:h-12 sm:w-12`}
            aria-label="다음 후기"
          >
            →
          </button>
        </div>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-shrink-0 min-w-[350px] md:min-w-[450px]"
            style={{
              scrollSnapAlign: "start",
            }}
          >
            <div
              className={`h-full transition-all duration-300 ${
                activeIndex === index
                  ? "scale-[1.05] shadow-lg"
                  : "scale-100 shadow-md"
              }`}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Dots */}
      {testimonials.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-[#F5472C]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`후기 ${index + 1} 보기`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
