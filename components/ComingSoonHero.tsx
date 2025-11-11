'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ComingSoonHero() {
  return (
    <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-white px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-3xl text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#F5472C]">
          Coming Soon
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Engz AI English Learning Platform
        </h1>
        <p className="mt-6 text-base text-gray-600 md:text-lg">
          Experience smart, personalized English learning powered by AI.
        </p>
        <p className="mt-3 text-sm text-gray-500 md:text-base">
          Launching Soon 🚀 Stay tuned for early access.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="https://open.kakao.com/o/sJDAeK6f"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
          >
            Notify Me
          </a>
          <Link
            href="/#service"
            className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-8 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-12 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-[#F5472C]"
            initial={{ width: '10%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          />
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Join the waitlist to be the first to experience the ENGZ AI platform.
        </p>
      </motion.div>
    </section>
  );
}
