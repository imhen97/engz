import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resultId = params.id;

    if (!resultId) {
      return NextResponse.json(
        { error: "Result ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.levelTestResult.findUnique({
      where: { id: resultId },
      select: {
        id: true,
        vocabScore: true,
        grammarScore: true,
        writingScore: true,
        totalScore: true,
        avgSpeed: true,
        rankPercent: true,
        overallLevel: true,
        strengths: true,
        weaknesses: true,
        recommendedRoutine: true,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...result,
      percentile: result.rankPercent || 50,
    });
  } catch (error) {
    console.error("❌ 결과 조회 실패:", error);
    return NextResponse.json(
      { error: "결과를 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
