"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  { label: "서비스", href: "/#service" },
  { label: "소개", href: "/#ceo" },
  { label: "구독 플랜", href: "https://www.eng-z.com/pricing" },
  { label: "AI 집중코스", href: "/ai-course" },
  { label: "AI 레벨 테스트", href: "/level-test" },
  { label: "후기", href: "/testimonials" },
  { label: "문의", href: "/#contact" },
];

const navLinkClass =
  "text-sm font-medium text-gray-600 transition hover:text-[#F5472C]";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    if (!href.startsWith("/#")) return;
    event.preventDefault();
    const id = href.replace("/#", "");
    if (pathname !== "/") {
      window.location.href = href;
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/85 py-3 backdrop-blur-md sm:py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-[#F5472C] sm:text-xl max-w-[120px] md:max-w-[160px]"
        >
          ENGZ
        </Link>
        <nav className="hidden lg:flex lg:items-center lg:gap-6">
          {menuItems.map((item) => {
            const isExternal = item.href.startsWith("http");
            const isActive = !isExternal && pathname === item.href;
            const labelClass = isActive
              ? "text-sm font-semibold text-[#F5472C]"
              : navLinkClass;
            if (isExternal) {
              return (
                <a key={item.label} href={item.href} className={labelClass}>
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={labelClass}
                onClick={(event) => handleAnchorClick(event, item.href)}
              >
                {item.label}
              </Link>
            );
          })}
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
          ) : session?.user ? (
            <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {session.user.name ?? "ENGZ 학습자"}님, 환영합니다 👋
              </span>
              <Link
                href="/learning-room"
                className="rounded-full bg-[#F5472C] px-4 py-1.5 text-sm font-semibold text-white transition hover:scale-105 whitespace-nowrap"
              >
                학습룸
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-[#F5472C] hover:text-[#F5472C] whitespace-nowrap"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="ml-4 rounded-full bg-[#F5472C] px-4 py-1.5 text-sm font-semibold text-white transition hover:scale-105 whitespace-nowrap"
            >
              로그인
            </Link>
          )}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#F5472C] hover:text-[#F5472C] lg:hidden"
          aria-label="메뉴 열기"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto mt-2 flex w-full max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6 lg:hidden"
          >
            {menuItems.map((item) => {
              const isExternal = item.href.startsWith("http");
              if (isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                  onClick={(event) => handleAnchorClick(event, item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
            {status === "loading" ? (
              <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-200" />
            ) : session?.user ? (
              <>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm">
                  {session.user.name ?? "ENGZ 학습자"}님, 환영합니다 👋
                </div>
                <Link
                  href="/learning-room"
                  className="rounded-2xl bg-[#F5472C] px-4 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  학습룸
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/signup"
                className="rounded-2xl bg-[#F5472C] px-4 py-3 text-sm font-semibold text-white shadow-sm"
              >
                로그인
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
