import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

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

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Allow anonymous users to take the test
    const userId = token?.userId as string | undefined;

    const body = await request.json();
    const { level, vocabScore, grammarScore, writingScore } = body;

    if (
      !level ||
      vocabScore === undefined ||
      grammarScore === undefined ||
      writingScore === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
      level,
      vocabScore,
      grammarScore,
      writingScore
    );

    // Save result if user is logged in
    let resultId: string | null = null;
    if (userId) {
      const result = await prisma.levelTestResult.create({
        data: {
          userId,
          levelSelected: level,
          vocabScore,
          grammarScore,
          writingScore,
          overallLevel,
          strengths,
          weaknesses,
          recommendedRoutine,
        },
      });
      resultId = result.id;
    } else {
      // For anonymous users, generate a temporary ID
      resultId = `temp_${Date.now()}`;
    }

    return NextResponse.json({
      id: resultId,
      levelSelected: level,
      vocabScore,
      grammarScore,
      writingScore,
      overallLevel,
      strengths,
      weaknesses,
      recommendedRoutine,
    });
  } catch (error) {
    console.error("❌ 테스트 결과 제출 실패:", error);
    return NextResponse.json(
      { error: "결과를 제출하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
