import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const resultId = params.id;

    // Handle temporary IDs for anonymous users
    if (resultId.startsWith("temp_")) {
      // Return data from sessionStorage (handled client-side)
      return NextResponse.json({ error: "Temporary result not found" }, { status: 404 });
    }

    // For logged-in users, fetch from database
    const userId = token?.userId as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.levelTestResult.findFirst({
      where: {
        id: resultId,
        userId,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: result.id,
      levelSelected: result.levelSelected,
      vocabScore: result.vocabScore,
      grammarScore: result.grammarScore,
      writingScore: result.writingScore,
      overallLevel: result.overallLevel,
      strengths: result.strengths || "",
      weaknesses: result.weaknesses || "",
      recommendedRoutine: result.recommendedRoutine || "",
    });
  } catch (error) {
    console.error("❌ 결과 가져오기 실패:", error);
    return NextResponse.json(
      { error: "결과를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

