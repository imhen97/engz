"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ComingSoonHero() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 pt-28 pb-20 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl text-center"
      >
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#F5472C] sm:text-sm">
          Coming Soon
        </p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Engz AI English Learning Platform
        </h1>
        <p className="mt-6 text-sm text-gray-600 sm:text-base md:text-lg">
          Experience smart, personalized English learning powered by AI.
        </p>
        <p className="mt-3 text-xs text-gray-500 sm:text-sm">
          Launching Soon 🚀 Stay tuned for early access.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
          <a
            href="https://open.kakao.com/o/sJDAeK6f"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:px-8"
          >
            Notify Me
          </a>
          <Link
            href="/#service"
            className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:px-8"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-10 h-2 w-full overflow-hidden rounded-full bg-gray-100 sm:mt-12">
          <motion.div
            className="h-full rounded-full bg-[#F5472C]"
            initial={{ width: "10%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        </div>

        <p className="mt-4 text-[0.72rem] text-gray-400 sm:text-xs">
          Join the waitlist to be the first to experience the ENGZ AI platform.
        </p>
      </motion.div>
    </section>
  );
}
