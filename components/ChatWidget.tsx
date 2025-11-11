"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ChatBubble from "@/components/ChatBubble";
import ChatHeader from "@/components/ChatHeader";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

type PendingBotMessage = {
  id: string;
  timeout: number;
};

const initialGreeting: Message = {
  id: "init-1",
  sender: "bot",
  text: "안녕하세요! ENGZ Assistant입니다. 궁금한 점이 있으시면 편하게 말씀해 주세요 😊",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputValue, setInputValue] = useState("");
  const pendingBotMessage = useRef<PendingBotMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  useEffect(() => () => {
      if (pendingBotMessage.current) {
        window.clearTimeout(pendingBotMessage.current.timeout);
      }
    }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    if (pendingBotMessage.current) {
      window.clearTimeout(pendingBotMessage.current.timeout);
    }

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: "빠르게 확인 중이에요! 곧 자세한 안내를 드릴게요. 😊",
    };

    const timeout = window.setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
      pendingBotMessage.current = null;
    }, 900);

    pendingBotMessage.current = {
      id: botMessage.id,
      timeout,
    };
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5472C] text-2xl text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5472C]"
        aria-label={isOpen ? "ENGZ 채팅 닫기" : "ENGZ 채팅 열기"}
      >
        💬
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 flex w-[320px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl sm:w-[360px]"
          >
            <ChatHeader onClose={handleToggle} />
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-[#FFF7F5] px-4 py-5"
            >
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  sender={message.sender}
                  message={message.text}
                />
              ))}
            </div>
            <div className="border-t border-gray-100 bg-white p-4">
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요"
                className="h-20 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-[#F5472C] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-3 w-full rounded-2xl bg-[#F5472C] py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
              >
                전송하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
