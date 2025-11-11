import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import AiCoursePageContent from "@/components/AiCoursePageContent";

export const metadata: Metadata = {
  title: "ENGZ AI 4주 집중 코스 | 자신 있게 말하는 영어",
  description:
    "ENGZ AI 4주 집중 코스는 개인 맞춤 미션과 AI 피드백으로 4주 안에 자신 있게 말하는 경험을 제공합니다.",
};

export default function AiCoursePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] text-black">
      <NavBar />
      <AiCoursePageContent />
      <footer className="bg-gray-900 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
