"use client";

type ChatBubbleProps = {
  sender: "user" | "bot";
  message: string;
};

export default function ChatBubble({ sender, message }: ChatBubbleProps) {
  const isUser = sender === "user";

  return (
    <div className={`w-full ${isUser ? "flex justify-end" : "flex justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#F5472C] text-white rounded-br-md"
            : "bg-white text-gray-700 border border-gray-100 rounded-bl-md"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
