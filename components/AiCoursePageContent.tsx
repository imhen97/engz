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
    app: "발음 점수만 보여주는 앱",
    engz: "문장 단위 교정과 대체 표현까지 제안",
  },
  {
    app: "오늘 학습 기록만 확인 가능",
    engz: "주간 성장 그래프 + Before → After 리포트 제공",
  },
  {
    app: "주제가 랜덤하고 커리큘럼이 없음",
    engz: "AI가 설계한 4주 집중 루틴",
  },
  {
    app: "혼자 꾸준히 하기 어려움",
    engz: "매일 AI 미션 + 선택형 코치 피드백",
  },
  {
    app: "피드백 기준이 제각각",
    engz: "데이터 기반 성장 설계",
  },
];

const steps = [
  {
    title: "1주차 – AI 진단",
    description:
      "발음·문법·유창성을 정밀 분석해 현재 상태를 데이터로 기록합니다.",
  },
  {
    title: "2~3주차 – 데일리 미션",
    description: "목표에 맞춘 연습 루틴을 AI가 매일 자동으로 제시합니다.",
  },
  {
    title: "매일 – AI 피드백",
    description: "문장 교정, 더 나은 표현 추천으로 말하기 자신감을 키웁니다.",
  },
  {
    title: "4주차 – 성장 리포트",
    description: "전후 변화가 한눈에 보이는 시각화 보고서를 받습니다.",
  },
  {
    title: "그다음 – 새로운 루틴 제안",
    description: "다음 4주를 위한 새로운 학습 로드맵을 다시 설계합니다.",
  },
];

const courses = [
  {
    title: "🎤 슬랭 마스터리",
    description:
      "넷플릭스·유튜브 슬랭을 익히고 발음까지 AI로 교정하는 프로그램",
  },
  {
    title: "🎶 팝 가사 코스",
    description: "노래 가사를 통해 문법·리듬·표현력을 동시에 끌어올립니다.",
  },
  {
    title: "🧠 IELTS 4주 코스",
    description: "AI 채점과 모범 답안 비교로 목표 점수 달성을 지원합니다.",
  },
  {
    title: "💼 비즈니스 영어",
    description: "회의·프레젠테이션을 위한 실전 시나리오 완전 대비 과정",
  },
  {
    title: "💬 스몰토크 코스",
    description: "자연스러운 일상 대화를 위한 문장과 상황별 표현 연습",
  },
];

const metrics = [
  { label: "발음 정확도", value: "76% → 93%" },
  { label: "표현 다양성", value: "+27%" },
  { label: "말하기 길이", value: "+18초" },
];

const philosophy = [
  { icon: "🧩", title: "AI가 학습 루틴을 설계합니다." },
  { icon: "💬", title: "피드백은 단순 교정이 아닌 이해입니다." },
  { icon: "📈", title: "성장은 감이 아닌 데이터로 측정합니다." },
];

const quotes = [
  "“3주차가 되니 영어로 말하는 두려움이 사라졌어요.”",
  "“AI 리포트에서 발음이 실제로 좋아진 걸 확인했습니다.”",
  "“앱은 반복이었고, ENGZ는 성장 그 자체였습니다.”",
];

const pricing = [
  {
    name: "🧩 무료 체험",
    price: "무료",
    details: "AI 진단 + 1일 미션 제공",
  },
  {
    name: "🎓 단일 코스",
    price: "₩39,000",
    details: "4주 집중 코스 1개 이용",
  },
  {
    name: "💼 전체 이용",
    price: "₩99,000 / 월",
    details: "모든 코스 + 무제한 성장 리포트",
  },
  {
    name: "👩‍🏫 프리미엄",
    price: "₩159,000 / 월",
    details: "전체 이용 + 1:1 코칭 세션 포함",
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
        className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 pt-28 pb-20 text-center sm:pt-32"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#FFF5F3]" />
        <div className="grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <div className="hidden flex-col gap-4 rounded-3xl border border-gray-100 bg-gray-50/70 p-6 shadow-sm backdrop-blur lg:flex">
            <p className="text-sm font-semibold text-gray-500">
              앱 학습 정체 구간
            </p>
            <div className="h-48 rounded-2xl bg-gradient-to-t from-gray-200 via-gray-100 to-white" />
            <p className="text-xs text-gray-500">
              진도가 멈추는 순간을 의미합니다.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#F5472C] sm:text-sm">
              4주 AI 집중 코스
            </p>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              앱 학습의 한계를 넘어 — 입에서 영어가 실제로 나오기 시작합니다.
            </h1>
            <p className="mt-6 text-sm text-gray-600 sm:text-base md:text-lg">
              ENGZ AI가 발음을 분석하고 나만의 문장을 설계해 4주 만에 전후 변화를 완성합니다.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:w-auto sm:px-8"
              >
                🎯 4주 코스 시작하기 →
              </Link>
              <Link
                href="/level-test"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:w-auto sm:px-8"
              >
                💬 무료 AI 레벨 테스트 →
              </Link>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="mt-8 text-xs font-medium text-gray-500 sm:text-sm"
            >
              AI 루틴을 설계하는 중…
            </motion.p>
          </div>

          <div className="hidden flex-col gap-4 rounded-3xl border border-[#F5472C]/30 bg-[#FFF0EC] p-6 shadow-sm backdrop-blur lg:flex">
            <p className="text-sm font-semibold text-[#F5472C]">
              ENGZ 성장 그래프
            </p>
            <motion.div
              initial={{ scaleY: 0.4 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="h-48 origin-bottom rounded-2xl bg-gradient-to-t from-[#F5472C] via-[#ff7a55] to-[#ffc3b3]"
            />
            <p className="text-xs text-[#F5472C]">
              ENGZ AI가 설계한 성장 곡선입니다.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            왜 앱으로는 영어가 늘지 않을까요?
          </h2>
          <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100 shadow-sm sm:mt-10">
            <div className="grid grid-cols-2 bg-gray-50 text-xs font-semibold text-gray-600 sm:text-sm">
              <div className="px-4 py-3 sm:px-6 sm:py-4">일반 앱 학습</div>
              <div className="px-4 py-3 text-[#F5472C] sm:px-6 sm:py-4">
                ENGZ 4주 코스
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {comparisonRows.map((row) => (
                <div
                  key={row.app}
                  className="grid grid-cols-1 border-b border-gray-100 last:border-b-0 md:grid-cols-2"
                >
                  <div className="px-4 py-4 text-sm text-gray-600 sm:px-6">
                    {row.app}
                  </div>
                  <div className="px-4 py-4 text-sm font-medium text-gray-800 md:border-l md:border-gray-100 sm:px-6">
                    {row.engz}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            ENGZ는 ‘앱 공부’가 아닙니다. AI가 설계한 영어 성장 시스템입니다.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-[#FFF7F5] px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            ENGZ AI가 4주 동안 당신의 영어를 설계하는 방법
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6"
              >
                <p className="text-sm font-semibold text-[#F5472C]">
                  {step.title}
                </p>
                <p className="mt-3 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              href="/level-test"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:w-auto sm:px-8"
            >
              🔍 AI 진단 먼저 받아보기 →
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
        className="bg-white px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            AI가 설계한 몰입형 4주 시리즈
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
            {courses.map((course) => (
              <div
                key={course.title}
                className="flex h-full flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h3>
                <p className="flex-1 text-sm text-gray-600">
                  {course.description}
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5472C]"
                >
                  → 지금 시작하기
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
        className="bg-[#FFF5F3] px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            연습이 아니라 눈에 보이는 성장
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-[#F5472C]/30 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold text-[#F5472C]">
                발음 파형 비교 (전 / 후)
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-4 text-center text-sm text-gray-600 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-gray-700">전</p>
                  <div className="mt-3 h-24 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#F5472C]">후</p>
                  <div className="mt-3 h-24 rounded-2xl bg-gradient-to-r from-[#F5472C] via-[#ff8a6c] to-[#ffd3c6]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm sm:p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-600">
            ENGZ는 감이 아닌 데이터로 영어 성장을 증명합니다.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-white px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            우리는 단순한 학습 플랫폼이 아닙니다.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-100 bg-white p-5 text-center shadow-sm sm:p-6"
              >
                <div className="text-3xl">{item.icon}</div>
                <p className="mt-4 text-sm font-semibold text-gray-800">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            ENGZ의 방식은 AI와 함께 진짜 영어 성장을 만드는 것입니다.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={transition}
        className="bg-[#FFF7F5] px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            단 4주 만에 영어가 달라진 사람들
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {quotes.map((quote) => (
              <div
                key={quote}
                className="rounded-3xl border border-white bg-white/80 p-5 text-sm text-gray-700 shadow-sm sm:p-6"
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
        className="bg-[#FFF0EC] px-6 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">
            4주 뒤, 당신의 영어는 완전히 달라질 거예요.
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            반복적인 앱 학습을 멈추고, AI가 설계한 진짜 변화를 경험해 보세요.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/level-test"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:w-auto sm:px-8"
            >
              🧠 무료 AI 진단부터 시작하기 →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#F5472C] px-6 py-3 text-sm font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:w-auto sm:px-8"
            >
              🎯 4주 집중 코스 살펴보기 →
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
