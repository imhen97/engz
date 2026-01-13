import type { NextRequest } from "next/server";
import { withErrorHandler, apiSuccess, getAuthToken } from "@/lib/api-handler";
import { AuthenticationError } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const GET = withErrorHandler(
  async (req: NextRequest) => {
    try {
      // Get token using helper that tries both cookie names
      const token = await getAuthToken(req);

      if (!token?.userId) {
        console.error("❌ Learning room API: No token or userId found");
        throw new AuthenticationError();
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
        return apiSuccess({
          routine: null,
          missions: [],
          todayMission: null,
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

      return apiSuccess({
        routine: {
          id: routine.id,
          userId: routine.userId,
          theme: routine.theme,
          startDate: routine.startDate,
          endDate: routine.endDate,
          completed: routine.completed,
          createdAt: routine.createdAt,
          updatedAt: routine.updatedAt,
        },
        missions: routine.missions,
        todayMission: todayMission || null,
        progress,
        currentWeek,
        currentDay,
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
      console.error("Learning room API error:", error);
      // Re-throw to let withErrorHandler handle it
      throw error;
    }
  },
  { requireAuth: true }
);
