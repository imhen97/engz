"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  initialSeconds: number;
  onTimeout: () => void;
  onTick?: (secondsLeft: number) => void;
}

export default function CountdownTimer({
  initialSeconds,
  onTimeout,
  onTick,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev - 1;
        if (onTick) {
          onTick(newSeconds);
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onTimeout, onTick]);

  const percentage = (seconds / initialSeconds) * 100;
  const isUrgent = seconds <= 3;

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90 transform">
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-200"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className={isUrgent ? "text-red-500" : "text-[#FF6B3D]"}
          initial={{ pathLength: 1 }}
          animate={{ pathLength: percentage / 100 }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <span
        className={`text-lg font-bold ${
          isUrgent ? "text-red-500" : "text-[#FF6B3D]"
        }`}
      >
        {seconds}
      </span>
    </div>
  );
}
