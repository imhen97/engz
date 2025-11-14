"use client";

import { motion } from "framer-motion";

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function ChartCard({
  title,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="h-64">{children}</div>
    </motion.div>
  );
}
