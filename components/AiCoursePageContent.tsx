"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const transition = { duration: 0.6, ease: "easeOut" };

const comparisonRows = [
  {
    app: "Shows only pronunciation score",
    engz: "Sentence-level correction + alternative suggestions",
  },
  {
    app: "Displays only today’s session",
    engz: "Weekly progress graph + Before→After report",
  },
  {
    app: "Many random topics, no structure",
    engz: "AI-designed 4-week structured routine",
  },
  {
    app: "Hard to stay consistent alone",
    engz: "Daily AI missions + optional human coach feedback",
  },
  {
    app: "Feedback feels random",
    engz: "Data-driven growth design",
  },
];

const steps = [
  {
    title: "Week 1 – AI Diagnosis",
    description: "Pronunciation, grammar & fluency analysis to map your baseline.",
  },
  {
    title: "Weeks 2–3 – Daily Missions",
    description: "Goal-based practice routines designed automatically for you.",
  },
  {
    title: "Daily – AI Feedback",
    description: "Sentence corrections, better expressions, and confidence boosts.",
  },
  {
    title: "Week 4 – Growth Report",
    description: "Visual Before vs After summary that proves your progress.",
  },
  {
    title: "Next Steps – AI Recommendation",
    description: "New routine design for the next stage of your English growth.",
  },
];

const courses = [
  {
    title: "🎤 Slang Mastery",
    description: "Master Netflix / YouTube slang with AI pronunciation correction.",
  },
  {
    title: "🎶 Pop Lyrics Course",
    description: "Improve grammar, rhythm, and expression through songs.",
  },
  {
    title: "🧠 IELTS 4-Week Course",
    description: "AI grading and model answer comparison tailored to your targets.",
  },
  {
    title: "💼 Business English",
    description: "Meeting and presentation full-prep program for professionals.",
  },
  {
    title: "💬 Small Talk Course",
    description: "Daily conversation practice to sound natural and confident.",
  },
];

const metrics = [
  { label: "Pronunciation Accuracy", value: "76% → 93%" },
  { label: "Expression Diversity", value: "+27%" },
  { label: "Speaking Length", value: "+18 sec" },
];

const philosophy = [
  { icon: "🧩", title: "AI designs your routine." },
  { icon: "💬", title: "Feedback means understanding." },
  { icon: "📈", title: "Growth is measured by data." },
];

const quotes = [
  "“By week 3, speaking English didn’t scare me anymore.”",
  "“The AI report showed real improvement in my pronunciation.”",
  "“Apps were repetition — ENGZ was growth.”",
];

const pricing = [
  {
    name: "🧩 Free Trial",
    price: "Free",
    details: "AI Diagnosis + 1-Day Mission",
  },
  {
    name: "🎓 Single Course",
    price: "₩39,000",
    details: "One 4-Week Intensive Course",
  },
  {
    name: "💼 All Access",
    price: "₩99,000 / mo",
    details: "All Courses + Unlimited Reports",
  },
  {
    name: "👩‍🏫 Premium",
    price: "₩159,000 / mo",
    details: "All Access + 1:1 Coaching Sessions",
  },
];

export default function AiCoursePageContent() {
  return (
    <div className="bg-white text-black font-[Pretendard]">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={sectionVariants}
        transition={transition}
        className="relative flex min-h-[calc(100vh-120px)] items-center justify-center px-6 py-32"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#FFF5F3]" />
        <div className="grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr_1fr]">
          <div className="hidden flex-col gap-4 rounded-3xl border border-gray-100 bg-gray-50/70 p-6 backdrop-blur-sm shadow-sm lg:flex">
            <p className="text-sm font-semibold text-gray-500">App Learning Plateau</p>
            <div className="h-48 rounded-2xl bg-gradient-to-t from-gray-200 via-gray-100 to-white" />
            <p className="text-xs text-gray-500">The moment progress slows down.</p>
          </div>

          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#F5472C]">
              4-Week AI Intensive
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Beyond the limits of app learning — you’ll actually start speaking English.
            </h1>
            <p className="mt-6 text-base text-gray-600 md:text-lg">
              ENGZ AI analyzes your pronunciation, builds personalized sentences, and creates
              your Before & After transformation in just 4 weeks.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="https://open.kakao.com/o/sJDAeK6f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                🎯 Start 4-Week Course →
              </Link>
              <Link
                href="https://open.kakao.com/o/sJDAeK6f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-8 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
              >
                💬 Get Free AI Level Test →
              </Link>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
              className="mt-10 text-sm font-medium text-gray-500"
            >
              Designing your AI routine…
            </motion.p>
          </div>

          <div className="hidden flex-col gap-4 rounded-3xl border border-[#F5472C]/30 bg-[#FFF0EC] p-6 backdrop-blur-sm shadow-sm lg:flex">
            <p className="text-sm font-semibold text-[#F5472C]">ENGZ Progress</p>
            <motion.div
              initial={{ scaleY: 0.4 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              className="h-48 origin-bottom rounded-2xl bg-gradient-to-t from-[#F5472C] via-[#ff7a55] to-[#ffc3b3]"
            />
            <p className="text-xs text-[#F5472C]">Growth engineered by ENGZ AI.</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="border-t border-gray-100 bg-white px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Why your English doesn’t improve with apps — now you’ll know.
          </h2>
          <div className="mt-10 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 bg-gray-50 text-sm font-semibold text-gray-600">
              <div className="px-6 py-4">Traditional App Learning</div>
              <div className="px-6 py-4 text-[#F5472C]">ENGZ 4-Week Course</div>
            </div>
            <div className="divide-y divide-gray-100">
              {comparisonRows.map((row) => (
                <div key={row.app} className="grid grid-cols-1 border-b border-gray-100 last:border-b-0 md:grid-cols-2">
                  <div className="px-6 py-4 text-sm text-gray-600">{row.app}</div>
                  <div className="px-6 py-4 text-sm font-medium text-gray-800 md:border-l md:border-gray-100">
                    {row.engz}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            ENGZ isn’t an ‘app study.’ It’s an AI-engineered English growth system.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-[#FFF7F5] px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Here’s how ENGZ AI designs your English growth over 4 weeks.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-semibold text-[#F5472C]">{step.title}</p>
                <p className="mt-3 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="https://open.kakao.com/o/sJDAeK6f"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              🔍 Get My AI English Diagnosis →
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-white px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            AI-Designed Immersion Course Series
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.title}
                className="flex h-full flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="flex-1 text-sm text-gray-600">{course.description}</p>
                <Link
                  href="https://open.kakao.com/o/sJDAeK6f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5472C]"
                >
                  → Start Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-[#FFF5F3] px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Visible Growth, Not Just Practice
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-[#F5472C]/30 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#F5472C]">
                Pronunciation Waveform Comparison
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-700">Before</p>
                  <div className="mt-3 h-24 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#F5472C]">After</p>
                  <div className="mt-3 h-24 rounded-2xl bg-gradient-to-r from-[#F5472C] via-[#ff8a6c] to-[#ffd3c6]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-600">
            ENGZ measures your English growth with data — not just feelings.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-white px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            We’re not just a learning platform.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="text-3xl">{item.icon}</div>
                <p className="mt-4 text-sm font-semibold text-gray-800">{item.title}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Learning English with AI — that’s the ENGZ way.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-[#FFF7F5] px-6 py-20"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            People who changed their English in just 4 weeks
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {quotes.map((quote) => (
              <div
                key={quote}
                className="rounded-3xl border border-white bg-white/80 p-6 text-sm text-gray-700 shadow-sm"
              >
                {quote}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-white px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Simple Plans</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className="flex h-full flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-[#F5472C]">{plan.price}</p>
                <p className="text-sm text-gray-600">{plan.details}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-[#FFF0EC] px-6 py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            In 4 weeks, your English will be completely different.
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Stop repetitive app learning. Experience real English transformation with AI.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://open.kakao.com/o/sJDAeK6f"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              🧠 Start with Free AI Diagnosis →
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-[#F5472C] px-8 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white"
            >
              🎯 Explore 4-Week Courses →
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
