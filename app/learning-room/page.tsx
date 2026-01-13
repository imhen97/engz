import { Suspense } from "react";
import LearningRoomContent from "@/components/learning-room/LearningRoomContent";

export default function LearningRoomPage() {
  try {
    return (
      <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
        <LearningRoomContent />
      </Suspense>
    );
  } catch (error) {
    console.error("LearningRoom page error:", error);
    // Return a fallback UI instead of crashing
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F5]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">페이지를 불러올 수 없습니다</p>
          <a href="/" className="text-[#F5472C] hover:underline">홈으로 돌아가기</a>
        </div>
      </div>
    );
  }
}
