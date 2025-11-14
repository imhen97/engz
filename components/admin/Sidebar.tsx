"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const menuItems = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/users", label: "사용자", icon: "👥" },
  { href: "/admin/tests", label: "레벨테스트", icon: "📝" },
  { href: "/admin/payments", label: "결제", icon: "💳" },
  { href: "/admin/feedback", label: "AI 피드백", icon: "🤖" },
  { href: "/admin/settings", label: "설정", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1E293B] text-white shadow-lg">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-xl font-bold text-[#FF6B3D]">ENGZ Admin</h1>
          <p className="mt-1 text-xs text-gray-400">관리자 대시보드</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-[#FF6B3D] text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ENGZ
          </p>
        </div>
      </div>
    </aside>
  );
}
