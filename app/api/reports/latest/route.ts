import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.userId) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = token.userId as string;

    // 사용자의 현재 루틴의 리포트 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        currentRoutine: {
          include: {
            report: true,
          },
        },
      },
    });

    if (!user?.currentRoutine?.report) {
      return NextResponse.json(null);
    }

    const report = user.currentRoutine.report;
    const routine = user.currentRoutine;

    // Calculate week number
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - routine.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const week = Math.min(Math.floor(daysSinceStart / 7) + 1, 4);

    return NextResponse.json({
      routineId: routine.id,
      theme: routine.theme,
      summary: report.summary,
      scoreChange: report.scoreChange,
      week,
      createdAt: report.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("❌ 리포트 데이터 가져오기 실패:", error);
    return NextResponse.json(
      { error: "데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
