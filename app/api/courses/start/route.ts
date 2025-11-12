import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { startDefaultCourseForUser } from "@/lib/progress";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    await startDefaultCourseForUser(session.user.id);
    return NextResponse.json({ 
      ok: true,
      message: "코스가 성공적으로 시작되었습니다."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "코스 시작 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
