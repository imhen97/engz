import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import ComingSoonHero from "@/components/ComingSoonHero";

export const metadata: Metadata = {
  title: "Engz AI – Coming Soon | Smart English Learning Platform",
  description:
    "ENGZ AI English Learning Platform is arriving soon. Experience smart, personalized English learning powered by AI and stay tuned for early access.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-[Pretendard] text-black">
      <NavBar />
      <ComingSoonHero />
      <footer className="bg-gray-900 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ENGZ. All rights reserved.
      </footer>
    </main>
  );
}
