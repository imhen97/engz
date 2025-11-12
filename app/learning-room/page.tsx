import { Suspense } from "react";
import LearningRoomContent from "@/components/learning-room/LearningRoomContent";

export default function LearningRoomPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">로딩 중…</div>}>
      <LearningRoomContent />
    </Suspense>
  );
}
