"use client";

import React, { useEffect, useState } from "react";

// 상단 메뉴바 + 통일된 문의 버튼 컬러 버전
export default function EngzLandingFull() {
  const [scrollY, setScrollY] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

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

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-[Pretendard] overflow-x-hidden scroll-smooth">
      {/* ✅ 상단 네비게이션 바 */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-bold text-[#F5472C] tracking-tight">
            ENGZ
          </h1>
          <nav className="space-x-8 text-sm font-medium text-gray-700">
            <a
              href="#service"
              onClick={(e) => handleNavClick(e, "service")}
              className="hover:text-[#F5472C] transition-colors"
            >
              서비스
            </a>
            <a
              href="#ceo"
              onClick={(e) => handleNavClick(e, "ceo")}
              className="hover:text-[#F5472C] transition-colors"
            >
              소개
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, "pricing")}
              className="hover:text-[#F5472C] transition-colors"
            >
              요금제
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="hover:text-[#F5472C] transition-colors"
            >
              문의
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        <div
          className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#F5472C] to-[#ff6a3c]"
          style={{
            transform: `translateX(${-100 * scrollProgress}%)`,
            transition: "transform 0.1s ease-out",
            borderTopRightRadius: "40%",
            borderBottomRightRadius: "40%",
          }}
        />
        <div
          className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#F5472C] to-[#ff6a3c]"
          style={{
            transform: `translateX(${100 * scrollProgress}%)`,
            transition: "transform 0.1s ease-out",
            borderTopLeftRadius: "40%",
            borderBottomLeftRadius: "40%",
          }}
        />
        <div
          className={`relative z-10 text-center text-black transition-all duration-1000 ease-in-out ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{
            opacity: (1 - scrollProgress * 1.5) * (fadeIn ? 1 : 0),
            transform: `translateY(${scrollProgress * -30}px)`,
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
            Welcome to ENGZ
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            AI기반 프리미엄 1:1 영어 코칭 브랜드
          </p>
        </div>
      </section>

      {/* 서비스 섹션 */}
      <section id="service" className="py-24 bg-white text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">ENGZ Core</h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-12">
            ENGZ는 AI 분석과 1:1 코칭을 결합한 영어 학습 서비스로, 발음 · 문법 ·
            표현력까지 정밀하게 분석하고 피드백합니다. 매주 성장 리포트를 통해
            학습의 변화를 시각적으로 확인할 수 있습니다.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">1:1 맞춤 코칭</h3>
              <p className="text-sm text-gray-600 leading-snug">
                개인 목표에 맞춘 주 1회 코칭 세션으로 발음, 문법, 스피킹을
                정교하게 다듬습니다.
              </p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">AI 피드백 & 분석</h3>
              <p className="text-sm text-gray-600 leading-snug">
                AI가 학습자의 음성·문법을 분석하고, 개선 포인트를 리포트 형태로
                제공합니다.
              </p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">주간 성장 리포트</h3>
              <p className="text-sm text-gray-600 leading-snug">
                한 주의 학습 데이터를 시각화해, 발전 정도와 다음 단계의 학습
                방향을 제시합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CEO 섹션 */}
      <section id="ceo" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="w-72 h-72 rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-gradient-to-br from-[#F5472C] to-[#ff6a3c] flex items-center justify-center text-white text-6xl font-bold relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.jpeg"
                alt="CEO 김해나 프로필"
                className="object-cover w-full h-full absolute inset-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.18em] text-gray-500 mb-2">
              CEO · FOUNDER
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4">
              김해나 (Hena Kim)
            </h2>
            <p className="text-lg font-semibold text-[#F5472C] mb-6 italic">
              &ldquo;언어의 장벽을 허물고, 세상과 연결되는 힘을 만든다.&rdquo;
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              학창 시절을 해외에서 보내며 실전 영어교육과 주입식 영어교육의
              차이를 직접 경험했습니다. 이때부터 &apos;영어를 지식이 아닌 기술로
              가르쳐야 한다&apos;는 신념이 생겼습니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              이후 20대 내내 영어 강사로 활동하며, 10대부터 60대까지 수백 명의
              학생들을 만나 왔습니다. 모두가 영어에 대한 열망은 있었지만, 영어로
              말하는 순간 느끼는 두려움과 장벽 때문에 성장에 한계를 겪는다는
              것을 발견했습니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              그래서 저는 누구나 두려움 없이 영어를 배우고 말할 수 있도록 돕는
              학습 플랫폼{" "}
              <span className="font-semibold text-[#F5472C]">ENGZ</span>를
              설립했습니다. 인공지능 기술과 사람의 피드백을 결합해 &apos;쉽고
              지속 가능한 영어 학습&apos;을 만드는 것이 ENGZ의 철학입니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              ENGZ는 대한민국을 넘어 글로벌 무대에서도 인정받는 영어 학습
              브랜드로 성장하는 것을 목표로 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 요금제 섹션 */}
      <section
        id="pricing"
        className="py-24 bg-white text-center border-t border-gray-100"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">요금제</h2>
          <p className="text-gray-600 text-sm mb-12">
            당신의 학습 스타일과 목표에 맞는 요금제를 선택하세요.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Starter</h3>
              <p className="text-gray-500 text-sm mb-3">월 19만 9천원</p>
              <p className="text-xs text-gray-600 leading-snug">
                주 1회 코칭 + 기본 AI 리포트 제공. 영어 공부를 처음 시작하는
                분들에게 적합합니다.
              </p>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 bg-black text-white">
              <h3 className="font-semibold mb-2">Standard</h3>
              <p className="text-gray-300 text-sm mb-3">월 24만 9천원</p>
              <p className="text-xs text-gray-300 leading-snug">
                주 1회 코칭 + 상세 리포트 + 주 2회 과제 피드백. 꾸준한 학습
                루틴을 만들고 싶은 분들을 위한 플랜.
              </p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Pro</h3>
              <p className="text-gray-500 text-sm mb-3">월 29만 9천원</p>
              <p className="text-xs text-gray-600 leading-snug">
                맞춤형 자료, 무제한 피드백, AI 심층 분석까지 포함된 집중 코칭
                플랜입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 문의 섹션 - 통일된 컬러 */}
      <section
        id="contact"
        className="py-24 bg-gray-50 text-center border-t border-gray-100"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">문의하기</h2>
          <p className="text-gray-600 text-sm mb-12">
            수업, 제휴, 인터뷰 등 모든 문의는 아래 채널을 통해 문의하실 수
            있습니다.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
            {[
              {
                href: "https://open.kakao.com/o/simhen97",
                label: "카카오톡",
                icon: "💬",
              },
              {
                href: "https://instagram.com/engz_kr",
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
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5472C] to-[#ff6a3c] text-white px-6 py-3 rounded-full font-medium shadow hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <span className="text-lg">{btn.icon}</span>
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
