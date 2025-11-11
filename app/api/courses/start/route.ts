import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { startDefaultCourseForUser } from "@/lib/progress";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  await startDefaultCourseForUser(session.user.id);

  return NextResponse.json({ ok: true });
}
