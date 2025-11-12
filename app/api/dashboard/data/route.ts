import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const userId = token.userId as string;

    // 사용자의 현재 코스 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        currentCourse: {
          include: {
            lessons: {
              orderBy: [{ week: "asc" }, { day: "asc" }],
            },
          },
        },
        enrollments: {
          where: { isCompleted: false },
          include: {
            course: true,
          },
          orderBy: { startedAt: "desc" },
          take: 1,
        },
      },
    });

    const currentEnrollment = user?.enrollments[0];
    const currentCourse = user?.currentCourse;

    return NextResponse.json({
      currentCourse: currentCourse
        ? {
            title: currentCourse.title,
            slug: currentCourse.slug,
          }
        : null,
      currentEnrollment: currentEnrollment
        ? {
            currentWeek: currentEnrollment.currentWeek,
            currentDay: currentEnrollment.currentDay,
          }
        : null,
    });
  } catch (error) {
    console.error("❌ 대시보드 데이터 가져오기 실패:", error);
    return NextResponse.json(
      { error: "데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

