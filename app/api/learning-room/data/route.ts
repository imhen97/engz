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

    // 사용자의 현재 루틴 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        currentRoutine: {
          include: {
            missions: {
              orderBy: [{ week: "asc" }, { day: "asc" }],
            },
            report: true,
          },
        },
      },
    });

    if (!user?.currentRoutine) {
      return NextResponse.json({
        id: null,
        theme: null,
        progress: 0,
        currentWeek: 1,
        currentDay: 1,
      });
    }

    const routine = user.currentRoutine;
    const totalMissions = routine.missions.length;
    const completedMissions = routine.missions.filter(
      (m) => m.completed
    ).length;
    const progress =
      totalMissions > 0
        ? Math.round((completedMissions / totalMissions) * 100)
        : 0;

    // 현재 주/일 계산
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - routine.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 4);
    const currentDay = Math.min((daysSinceStart % 7) + 1, 5);

    // 오늘의 미션 찾기
    const todayMission = routine.missions.find(
      (m) => m.week === currentWeek && m.day === currentDay
    );

    // 다음 튜터 세션 (목요일 오후 8시 - 목 데이터)
    const nextThursday = new Date(now);
    nextThursday.setDate(now.getDate() + ((4 + 7 - now.getDay()) % 7 || 7));
    nextThursday.setHours(20, 0, 0, 0);

    return NextResponse.json({
      id: routine.id,
      theme: routine.theme,
      startDate: routine.startDate.toISOString(),
      endDate: routine.endDate.toISOString(),
      completed: routine.completed,
      progress,
      currentWeek,
      currentDay,
      todayMission: todayMission
        ? {
            id: todayMission.id,
            week: todayMission.week,
            day: todayMission.day,
            content: todayMission.content,
            aiFeedback: todayMission.aiFeedback,
            completed: todayMission.completed,
          }
        : null,
      upcomingSession: {
        date: nextThursday.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
        time: "8 PM",
        type: "1:1 Tutor Call",
      },
      feedbackSummary: {
        grammar: "B+",
        pronunciation: "A-",
        fluency: "B",
      },
    });
  } catch (error) {
    console.error("❌ Learning Room 데이터 가져오기 실패:", error);
    return NextResponse.json(
      { error: "데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
