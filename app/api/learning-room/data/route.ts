import type { NextRequest } from "next/server";
import { withErrorHandler, apiSuccess, getAuthToken } from "@/lib/api-handler";
import { AuthenticationError } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Helper to convert score to letter grade
function getGrade(score: number | null): string {
  if (score === null) return "-";
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  return "D";
}

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
          feedbackSessions: {
            orderBy: { createdAt: "desc" },
            take: 10, // Get last 10 feedback sessions for average
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

      // 다음 튜터 세션 (목요일 오후 8시)
      const nextThursday = new Date(now);
      nextThursday.setDate(now.getDate() + ((4 + 7 - now.getDay()) % 7 || 7));
      nextThursday.setHours(20, 0, 0, 0);

      // 피드백 요약 계산 (최근 피드백 세션 평균)
      let feedbackSummary = null;
      if (user.feedbackSessions && user.feedbackSessions.length > 0) {
        const sessions = user.feedbackSessions;
        const avgGrammar = Math.round(
          sessions.reduce((sum, s) => sum + (s.grammarScore || 0), 0) / sessions.length
        );
        const avgPronunciation = Math.round(
          sessions.reduce((sum, s) => sum + (s.pronunciationScore || 0), 0) / sessions.length
        );
        const avgFluency = Math.round(
          sessions.reduce((sum, s) => sum + (s.fluencyScore || 0), 0) / sessions.length
        );

        feedbackSummary = {
          grammar: getGrade(avgGrammar),
          pronunciation: getGrade(avgPronunciation),
          fluency: getGrade(avgFluency),
          avgGrammar,
          avgPronunciation,
          avgFluency,
        };
      } else if (completedMissions > 0) {
        // 완료된 미션이 있지만 피드백 세션이 없으면 기본값 제공
        feedbackSummary = {
          grammar: "B+",
          pronunciation: "B",
          fluency: "B",
          avgGrammar: 82,
          avgPronunciation: 78,
          avgFluency: 75,
        };
      }

      // 3일 전 미션 찾기 (복습용)
      const threeDaysAgo = routine.missions.find((m) => {
        const missionDay = (m.week - 1) * 5 + m.day;
        const currentTotalDay = (currentWeek - 1) * 5 + currentDay;
        return missionDay === currentTotalDay - 3 && m.completed;
      });

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
        reviewMission: threeDaysAgo || null,
        progress,
        currentWeek,
        currentDay,
        completedCount: completedMissions,
        totalCount: totalMissions,
        upcomingSession: {
          date: nextThursday.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
          }),
          time: "오후 8시",
          type: "1:1 튜터 세션",
        },
        feedbackSummary,
      });
    } catch (error) {
      console.error("Learning room API error:", error);
      // Re-throw to let withErrorHandler handle it
      throw error;
    }
  },
  { requireAuth: true }
);
