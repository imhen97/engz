import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

function determineOverallLevel(
  vocabScore: number,
  grammarScore: number,
  writingScore: number
): string {
  const avgScore = (vocabScore + grammarScore + writingScore) / 3;

  if (avgScore >= 80) return "Advanced";
  if (avgScore >= 60) return "Upper-Intermediate";
  if (avgScore >= 40) return "Intermediate";
  return "Beginner";
}

function generateStrengths(
  vocabScore: number,
  grammarScore: number,
  writingScore: number
): string {
  const strengths: string[] = [];
  if (vocabScore >= 70) strengths.push("Vocabulary & Word Usage");
  if (grammarScore >= 70) strengths.push("Grammar Accuracy");
  if (writingScore >= 70) strengths.push("Writing & Expression");
  if (strengths.length === 0) strengths.push("Basic Communication Skills");
  return strengths.join(", ");
}

function generateWeaknesses(
  vocabScore: number,
  grammarScore: number,
  writingScore: number
): string {
  const weaknesses: string[] = [];
  if (vocabScore < 60) weaknesses.push("Vocabulary Range");
  if (grammarScore < 60) weaknesses.push("Grammar Accuracy");
  if (writingScore < 60) weaknesses.push("Sentence Fluency");
  if (weaknesses.length === 0) weaknesses.push("Minor areas for improvement");
  return weaknesses.join(", ");
}

function generateRecommendedRoutine(
  level: string,
  vocabScore: number,
  grammarScore: number,
  writingScore: number
): string {
  const lowest = Math.min(vocabScore, grammarScore, writingScore);

  if (lowest === grammarScore) {
    return "4-week Grammar & Writing Focus Routine";
  }
  if (lowest === vocabScore) {
    return "4-week Vocabulary & Expression Building Routine";
  }
  return "4-week Writing & Fluency Enhancement Routine";
}

// PRD: Generate AI ment based on 10-level system
function generateAiMent(totalScore: number): string {
  if (totalScore >= 90) {
    return "슈퍼 영어 엘리트! Engz AI의 코치로 오셔야겠어요 😎";
  }
  if (totalScore >= 80) {
    return "상위 10%! 당신은 거의 영어 고수입니다.";
  }
  if (totalScore >= 70) {
    return "상위 30%! 이제 비즈니스 영어에도 도전 가능해요.";
  }
  if (totalScore >= 60) {
    return "좋아요! 이제 영어가 입에 익어가는 단계예요.";
  }
  if (totalScore >= 50) {
    return "중급 문법 구조는 익혔어요! 표현만 조금 더 확장해볼까요?";
  }
  if (totalScore >= 40) {
    return "기본 표현은 익숙하지만 말하기 자신감이 부족해요.";
  }
  if (totalScore >= 30) {
    return "기초 회화는 가능하지만 아직 문법이 헷갈려요.";
  }
  if (totalScore >= 20) {
    return "이제 막 영어 입문하셨군요!";
  }
  return "앗! 우리 영어 공부하러 갈까요?";
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Require login to submit test results
    const userId = token?.userId as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다.", requiresLogin: true },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { level, vocabScore, grammarScore, writingScore, avgSpeed } = body;

    if (
      vocabScore === undefined ||
      grammarScore === undefined ||
      writingScore === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check which columns exist (for backwards compatibility if migration not yet applied)
    const columns =
      (await prisma.$queryRaw<
        { column_name: string }[]
      >`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'LevelTestResult'`) ||
      [];
    const columnSet = new Set(
      columns.map((column) => column.column_name.toLowerCase())
    );
    const hasTotalScoreColumn = columnSet.has("totalscore");
    const hasAvgSpeedColumn = columnSet.has("avgspeed");
    const hasRankPercentColumn = columnSet.has("rankpercent");
    const hasAiMentColumn = columnSet.has("aiment");

    // Calculate total score (average)
    const totalScore = Math.round(
      (vocabScore + grammarScore + writingScore) / 3
    );

    const overallLevel = determineOverallLevel(
      vocabScore,
      grammarScore,
      writingScore
    );
    const strengths = generateStrengths(vocabScore, grammarScore, writingScore);
    const weaknesses = generateWeaknesses(
      vocabScore,
      grammarScore,
      writingScore
    );
    const recommendedRoutine = generateRecommendedRoutine(
      level || "intermediate",
      vocabScore,
      grammarScore,
      writingScore
    );

    // Calculate rank percentile based on total score
    let rankPercent: number | null = null;
    if (hasTotalScoreColumn && hasRankPercentColumn) {
      try {
        const allResults = await prisma.levelTestResult.findMany({
          select: { totalScore: true },
        });
        const scores = allResults
          .map((r) => r.totalScore || 0)
          .filter((s) => s > 0);
        scores.push(totalScore);
        scores.sort((a, b) => a - b);
        rankPercent = Math.round(
          (scores.indexOf(totalScore) / scores.length) * 100
        );
      } catch (error) {
        console.warn("⚠️ Rank percentile calculation skipped:", error);
        rankPercent = null;
      }
    }

    // Generate AI ment (10-level motivational message)
    const aiMent = generateAiMent(totalScore);

    // Save result to database (user is logged in)
    const createData: Prisma.LevelTestResultUncheckedCreateInput = {
      userId,
      levelSelected: level || null,
      vocabScore,
      grammarScore,
      writingScore,
      overallLevel,
      strengths,
      weaknesses,
      recommendedRoutine,
    };
    if (hasTotalScoreColumn) {
      createData.totalScore = totalScore;
    }
    if (hasAvgSpeedColumn) {
      createData.avgSpeed = avgSpeed ?? null;
    }
    if (hasRankPercentColumn && rankPercent !== null) {
      createData.rankPercent = rankPercent;
    }
    if (hasAiMentColumn) {
      createData.aiMent = aiMent;
    }

    const result = await prisma.levelTestResult.create({
      data: createData,
    });

    const resultId = result.id;

    // Send email notification (async, don't wait for it)
    if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
      // Get user email from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user?.email) {
        // Send email in background (don't block response)
        fetch(
          `${
            process.env.NEXT_PUBLIC_URL || "https://www.eng-z.com"
          }/api/leveltest/send-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              resultId: result.id,
            }),
          }
        ).catch((err) => {
          console.error("이메일 발송 백그라운드 오류:", err);
        });
      }
    }

    return NextResponse.json({
      id: resultId,
      levelSelected: level || null,
      vocabScore,
      grammarScore,
      writingScore,
      totalScore,
      avgSpeed: avgSpeed ?? null,
      rankPercent,
      overallLevel,
      strengths,
      weaknesses,
      recommendedRoutine,
      aiMent,
    });
  } catch (error) {
    console.error("❌ 테스트 결과 제출 실패:", error);
    return NextResponse.json(
      { error: "결과를 제출하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
