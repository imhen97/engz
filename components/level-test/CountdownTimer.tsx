"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  initialSeconds: number;
  onTimeout: () => void;
  onTick?: (secondsLeft: number) => void;
  resetKey?: string | number; // 문제가 바뀔 때 리셋하기 위한 key
}

export default function CountdownTimer({
  initialSeconds,
  onTimeout,
  onTick,
  resetKey,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timeoutCalled = useRef(false);

  // 문제가 바뀔 때마다 타이머 리셋
  useEffect(() => {
    setSeconds(initialSeconds);
    timeoutCalled.current = false;
  }, [resetKey, initialSeconds]);

  useEffect(() => {
    if (seconds <= 0 && !timeoutCalled.current) {
      timeoutCalled.current = true;
      onTimeout();
      return;
    }

    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (!timeoutCalled.current) {
            timeoutCalled.current = true;
            onTimeout();
          }
          return 0;
        }
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
