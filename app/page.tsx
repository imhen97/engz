"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { testimonials } from "@/data/testimonials";

// 상단 메뉴바 + 통일된 문의 버튼 컬러 버전
export default function EngzLandingFull() {
  const [scrollY, setScrollY] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    const fadeTimer = setTimeout(() => setFadeIn(true), 300);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(fadeTimer);
    };
  }, []);

  const scrollProgress =
    typeof window !== "undefined"
      ? Math.min(scrollY / window.innerHeight, 1)
      : 0;

  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] scroll-smooth text-black">
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-white px-4 pt-24 text-center sm:px-6 sm:pt-28 md:px-8 lg:px-10 lg:pt-32">
        <div
          className="hidden sm:block absolute left-0 top-0 h-full w-1/2 -translate-x-[calc(100%*var(--progress,0))] transform rounded-r-[40%] bg-gradient-to-r from-[#F5472C] to-[#ff6a3c] transition-transform duration-200 ease-out sm:w-1/2"
          style={{ transform: `translateX(${-100 * scrollProgress}%)` }}
        />
        <div
          className="hidden sm:block absolute right-0 top-0 h-full w-1/2 translate-x-[calc(100%*var(--progress,0))] transform rounded-l-[40%] bg-gradient-to-l from-[#F5472C] to-[#ff6a3c] transition-transform duration-200 ease-out sm:w-1/2"
          style={{ transform: `translateX(${100 * scrollProgress}%)` }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: fadeIn ? 1 : 0, y: fadeIn ? 0 : 10 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex max-w-3xl flex-col items-center gap-4"
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Welcome to ENGZ
          </h1>
          <p className="text-xs text-gray-600 sm:text-sm md:text-base">
            AI 기반 프리미엄 영어 코칭 브랜드
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={
                status === "loading"
                  ? "loading"
                  : !session?.user
                  ? "guest"
                  : session.user.subscriptionActive
                  ? "subscribed"
                  : "nosub"
              }
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
            >
              {status === "loading" && (
                <div className="rounded-full border border-white/60 px-6 py-3 text-sm text-white/80">
                  AI 학습 환경을 확인하고 있습니다…
                </div>
              )}
              {status !== "loading" && !session?.user && (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#F5472C] px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:scale-[1.03] sm:max-w-none sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
                  >
                    무료 AI 레벨 테스트 체험하기 →
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-[#F5472C] px-5 py-2.5 text-xs font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:max-w-none sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
                  >
                    7일 무료 체험 시작하기 →
                  </Link>
                </>
              )}
              {status !== "loading" &&
                session?.user &&
                !session.user.subscriptionActive && (
                  <Link
                    href="/pricing"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] sm:w-auto"
                  >
                    플랜 구독하기 →
                  </Link>
                )}
              {status !== "loading" && session?.user?.subscriptionActive && (
                <Link
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] sm:w-auto"
                >
                  AI 학습 룸 이동하기 →
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 서비스 섹션 */}
      <section
        id="service"
        className="bg-white px-4 py-12 text-center sm:px-6 sm:py-16 md:px-8 lg:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl">
            ENGZ 핵심 서비스
          </h2>
          <p className="mb-8 text-xs leading-relaxed text-gray-600 sm:mb-10 sm:text-sm md:mb-12 md:text-base">
            ENGZ는 AI 분석과 1:1 코칭을 결합한 영어 학습 서비스로, 발음 · 문법 ·
            표현력까지 정밀하게 분석하고 피드백합니다.
            <br className="hidden sm:block" />
            매주 성장 리포트를 통해 학습의 변화를 시각적으로 확인할 수 있습니다.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-6">
              <h3 className="mb-2 text-base font-semibold sm:text-lg">
                1:1 맞춤 코칭
              </h3>
              <p className="text-xs leading-snug text-gray-600 sm:text-sm">
                개인 목표에 맞춘 주 1회 코칭 세션으로 발음, 문법, 스피킹을
                정교하게 다듬습니다.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-6">
              <h3 className="mb-2 text-base font-semibold sm:text-lg">
                AI 피드백 & 분석
              </h3>
              <p className="text-xs leading-snug text-gray-600 sm:text-sm">
                AI가 학습자의 음성·문법을 분석하고, 개선 포인트를 리포트 형태로
                제공합니다.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-6">
              <h3 className="mb-2 text-base font-semibold sm:text-lg">
                주간 성장 리포트
              </h3>
              <p className="text-xs leading-snug text-gray-600 sm:text-sm">
                한 주의 학습 데이터를 시각화해, 발전 정도와 다음 단계의 학습
                방향을 제시합니다.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center sm:mt-10 md:mt-12">
            <Link
              href="/ai-course"
              className="inline-flex items-center gap-2 rounded-full border border-[#F5472C] px-6 py-2.5 text-xs font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:px-8 sm:py-3 sm:text-sm"
            >
              더 알아보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* CEO 섹션 */}
      <section
        id="ceo"
        className="py-12 bg-gray-50 border-t border-gray-100 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-base font-medium text-[#F5472C] sm:text-lg md:text-xl"
            >
              현직 영어강사가 직접 개발한 AI 기반 영어학습 플랫폼
            </motion.p>
            <p className="text-xs tracking-[0.18em] text-gray-500 mb-2 sm:text-sm">
              CEO · FOUNDER · 대표 · 설립자
            </p>
            <h2 className="text-xl font-bold leading-snug mb-3 sm:text-2xl md:mb-4 md:text-3xl">
              김해나 (KIM HAE NA)
            </h2>
            <p className="text-base font-semibold text-[#F5472C] mb-4 italic sm:text-lg md:mb-6">
              &ldquo;언어의 장벽을 허물고, 세상과 연결되는 힘을 만든다.&rdquo;
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3 sm:text-sm sm:mb-4">
              학창 시절을 해외에서 보내며 실전 영어교육과 주입식 영어교육의
              차이를 직접 경험했습니다. 이때부터 &apos;영어를 지식이 아닌 기술로
              가르쳐야 한다&apos;는 신념이 생겼습니다.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3 sm:text-sm sm:mb-4">
              이후 20대 내내 영어 강사로 활동하며, 10대~60대 전연령층의 수백
              명의 학생들을 만나 왔습니다. 모두가 영어에 대한 열망은 있었지만,
              영어로 말하는 순간 느끼는 두려움과 장벽 때문에 성장에 한계를
              겪는다는 것을 발견했습니다.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3 sm:text-sm sm:mb-4">
              그래서 저는 누구나 두려움 없이 영어를 배우고 말할 수 있도록 돕는
              학습 플랫폼{" "}
              <span className="font-semibold text-[#F5472C]">ENGZ</span>를
              설립했습니다. 인공지능 기술과 사람의 피드백을 결합해 &apos;쉽고
              지속 가능한 영어 학습&apos;을 만드는 것이 ENGZ의 철학입니다.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed sm:text-sm">
              ENGZ는 대한민국을 넘어 글로벌 무대에서도 인정받는 영어 학습
              브랜드로 성장하는 것을 목표로 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 후기 하이라이트 섹션 */}
      <section
        className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:px-10 lg:py-20"
        id="success"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-10 md:mb-12">
            <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C]">
              성공 후기
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:mt-4 sm:text-3xl md:text-4xl">
              ENGZ 수강생의 성장 여정
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-gray-600 sm:mt-4 sm:text-sm md:text-base">
              ENGZ 코칭을 통해 커리어와 일상을 바꾼 수강생들의 실제 이야기를
              확인해 보세요.
            </p>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section
        id="pricing"
        className="py-12 bg-white text-center border-t border-gray-100 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <h2 className="text-2xl font-bold mb-4 sm:text-3xl sm:mb-6 md:text-4xl md:mb-8">
            무료 체험으로 ENGZ를 직접 경험해 보세요
          </h2>
          <p className="text-xs text-gray-600 mb-8 sm:text-sm sm:mb-10 md:mb-12">
            7일 무료 체험으로 AI 집중코스와 레벨 테스트를 먼저 살펴본 뒤, 더
            자세한 플랜은 상단의 구독 플랜 페이지에서 확인해 주세요.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://www.eng-z.com/pricing"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-[#F5472C] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition hover:scale-105 sm:max-w-none sm:w-auto sm:px-8 sm:py-3 sm:text-sm"
            >
              구독 플랜 확인하기 →
            </a>
            <a
              href="/level-test"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-[#F5472C] px-6 py-2.5 text-xs font-semibold text-[#F5472C] transition hover:bg-[#F5472C] hover:text-white sm:max-w-none sm:w-auto sm:px-8 sm:py-3 sm:text-sm"
            >
              AI 레벨 테스트 체험하기 →
            </a>
          </div>
        </div>
      </section>

      {/* 문의 섹션 - 통일된 컬러 */}
      <section
        id="contact"
        className="py-12 bg-gray-50 text-center border-t border-gray-100 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <h2 className="text-2xl font-bold mb-4 sm:text-3xl sm:mb-6 md:text-4xl md:mb-8">
            문의하기
          </h2>
          <p className="text-xs text-gray-600 mb-8 sm:text-sm sm:mb-10 md:mb-12">
            수업, 제휴, 인터뷰 등 모든 문의는 아래 채널을 통해 문의하실 수
            있습니다.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row sm:gap-6 sm:mt-8">
            {[
              {
                href: "https://open.kakao.com/o/sJDAeK6f",
                label: "카카오톡",
                icon: "💬",
              },
              {
                href: "https://www.instagram.com/engz_kr?igsh=MWNsemFkNGN5MWpwYw%3D%3D&utm_source=qr",
                label: "인스타그램",
                icon: "📷",
              },
              {
                href: "mailto:hena.k@eng-z.com",
                label: "이메일",
                icon: "✉️",
              },
            ].map((btn, i) => (
              <a
                key={i}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full max-w-xs items-center justify-center gap-2 bg-gradient-to-r from-[#F5472C] to-[#ff6a3c] text-white px-5 py-2.5 rounded-full text-xs font-medium shadow hover:scale-105 hover:shadow-lg transition-all duration-300 sm:max-w-none sm:w-auto sm:px-6 sm:py-3 sm:text-sm"
              >
                <span className="text-base sm:text-lg">{btn.icon}</span>
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 text-center text-xs py-6">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
