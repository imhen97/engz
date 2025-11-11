"use client";

import { motion } from "framer-motion";

import { Testimonial } from "@/data/testimonials";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex h-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-8 text-left shadow-md"
    >
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#F5472C]">
          Success Story
        </p>
        <h3 className="text-lg font-semibold text-gray-900">
          {testimonial.name} · {testimonial.role} · {testimonial.city}
        </h3>
        <p className="text-sm font-medium text-gray-600">
          {testimonial.course}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
        <span className="rounded-full bg-[#FFF0EC] px-3 py-1 text-[#F5472C]">
          {testimonial.improvement}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
          {testimonial.duration}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700">
        {testimonial.story}
      </p>
    </motion.article>
  );
}
