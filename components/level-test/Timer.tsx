"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TimerProps = {
  duration: number; // seconds
  onComplete: () => void;
  onTick?: (remaining: number) => void;
};

export default function Timer({ duration, onComplete, onTick }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          onComplete();
          return 0;
        }
        onTick?.(next);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [remaining, onComplete, onTick]);

  const progress = (remaining / duration) * 100;
  const isLowTime = remaining <= 2;

  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90 transform">
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="none"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke={isLowTime ? "#EF4444" : "#FF6B3D"}
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 28}`}
          strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: `${2 * Math.PI * 28}` }}
          animate={{
            strokeDashoffset: `${2 * Math.PI * 28 * (1 - progress / 100)}`,
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-lg font-bold ${
            isLowTime ? "text-red-500" : "text-gray-900"
          }`}
        >
          {Math.ceil(remaining)}
        </span>
      </div>
    </div>
  );
}
