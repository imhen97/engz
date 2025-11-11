"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function TestStep({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg backdrop-blur"
    >
      {children}
    </motion.div>
  );
}
