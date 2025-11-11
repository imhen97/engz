"use client";

type ChatHeaderProps = {
  onClose: () => void;
};

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-t-3xl bg-[#F5472C] px-5 py-4 text-white">
      <div>
        <p className="text-sm font-semibold tracking-tight">Engz Assistant 💬</p>
        <p className="text-xs text-white/80">무엇을 도와드릴까요?</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full border border-white/40 px-2 py-1 text-xs font-medium transition hover:bg-white hover:text-[#F5472C]"
        aria-label="채팅 닫기"
      >
        닫기
      </button>
    </div>
  );
}
