"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="fixed right-0 top-0 z-10 h-16 w-[calc(100%-16rem)] border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            관리자 대시보드
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg bg-[#FF6B3D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#FF6B3D]/90"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
