"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";

export default function LevelTestPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // 인증되지 않은 경우에도 테스트는 가능하도록 함
    // 시작 페이지로 리다이렉트
    router.push("/level-test/start");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">로딩 중…</p>
      </div>
    </main>
  );
}
