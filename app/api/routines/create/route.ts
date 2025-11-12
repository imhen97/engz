import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

// Generate 4-week routine missions (5 missions per week = 20 total)
function generateMissions(theme: string) {
  const missions = [];
  const themes: Record<string, string[]> = {
    grammar: [
      "Practice present tense with 5 sentences",
      "Master past tense irregular verbs",
      "Learn future tense constructions",
      "Practice conditional sentences",
      "Review perfect tenses",
    ],
    slang: [
      "Learn 10 common slang expressions",
      "Practice idioms in context",
      "Master casual conversation phrases",
      "Learn internet slang and abbreviations",
      "Practice slang in different situations",
    ],
    business: [
      "Practice professional email writing",
      "Master business meeting phrases",
      "Learn negotiation vocabulary",
      "Practice presentation skills",
      "Review business etiquette expressions",
    ],
    travel: [
      "Learn airport and hotel phrases",
      "Practice restaurant ordering",
      "Master directions and transportation",
      "Learn shopping and bargaining phrases",
      "Practice emergency situations",
    ],
    speaking: [
      "Record 3-minute self-introduction",
      "Practice pronunciation of difficult sounds",
      "Master intonation patterns",
      "Practice fluency with timed speaking",
      "Review and improve previous recordings",
    ],
  };

  const themeMissions = themes[theme] || themes.speaking;

  for (let week = 1; week <= 4; week++) {
    for (let day = 1; day <= 5; day++) {
      const missionIndex = ((week - 1) * 5 + (day - 1)) % themeMissions.length;
      missions.push({
        week,
        day,
        content: `Week ${week}, Day ${day}: ${themeMissions[missionIndex]}`,
      });
    }
  }

  return missions;
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { theme } = body;

    if (!theme || !THEMES.includes(theme)) {
      return NextResponse.json(
        { error: "유효한 테마를 선택해주세요." },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 28); // 4 weeks

    const missions = generateMissions(theme);

    // Create routine with missions
    const routine = await prisma.routine.create({
      data: {
        userId,
        theme: theme.charAt(0).toUpperCase() + theme.slice(1),
        startDate,
        endDate,
        completed: false,
        missions: {
          create: missions,
        },
      },
      include: {
        missions: true,
      },
    });

    // Update user's current routine
    await prisma.user.update({
      where: { id: userId },
      data: { currentRoutineId: routine.id },
    });

    return NextResponse.json({ routineId: routine.id });
  } catch (error) {
    console.error("❌ 루틴 생성 실패:", error);
    return NextResponse.json(
      { error: "루틴을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

const THEMES = ["grammar", "slang", "business", "travel", "speaking"];
