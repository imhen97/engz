"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  current: number;
  total: number;
  section?: string; // Optional section name for backward compatibility
};

export default function ProgressBar({
  current,
  total,
  section,
}: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          {section ? `${section}: ` : ""}Question {current} of {total}
        </span>
        <span className="text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-full bg-[#FF6B3D]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
