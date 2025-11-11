import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import AiCoursePageContent from "@/components/AiCoursePageContent";

export const metadata: Metadata = {
  title: "ENGZ AI 4-Week Intensive Course | Speak Confident English",
  description:
    "ENGZ AI 4-Week Intensive Course delivers personalized missions, AI feedback, and measurable growth so you actually start speaking English in 4 weeks.",
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
