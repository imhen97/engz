import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENGZ - 프리미엄 1:1 영어회화 | AI 기반 맞춤형 밀착 코칭",
  description:
    "ENGZ는 AI 분석과 1:1 코칭을 결합한 영어 학습 서비스입니다. 발음, 문법, 표현력을 정밀하게 분석하고 피드백합니다. 영어를 배우고, 자신있게 말하세요.",
  keywords:
    "영어회화, 1:1 코칭, AI 영어학습, IELTS, OPIc, TOEIC, 비즈니스 영어",
  openGraph: {
    title: "ENGZ - 프리미엄 1:1 영어회화",
    description:
      "AI 기반 맞춤형 밀착 코칭으로 영어를 배우고, 자신있게 말하세요.",
    type: "website",
    url: "https://eng-z.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProviderWrapper>
          {children}
          <ChatWidget />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
