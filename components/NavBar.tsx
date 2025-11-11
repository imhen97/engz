"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const menuItems = [
  { label: "서비스", href: "/#service" },
  { label: "소개", href: "/#ceo" },
  { label: "구독 플랜", href: "https://www.eng-z.com/pricing" },
  { label: "AI 집중코스", href: "/ai-course" },
  { label: "AI 레벨 테스트", href: "/level-test" },
  { label: "AI 플랫폼", href: "/coming-soon" },
  { label: "후기", href: "/testimonials" },
  { label: "문의", href: "/#contact" },
];

const navLinkClass =
  "text-sm font-medium text-gray-600 transition hover:text-[#F5472C]";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/85 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#F5472C]"
        >
          ENGZ
        </Link>
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
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
            className="mx-auto mt-2 flex w-full max-w-6xl flex-col gap-2 px-6 py-4 lg:hidden"
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
