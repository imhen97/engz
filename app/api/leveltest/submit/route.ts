import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Answer = {
  questionId: string;
  answer: string | number;
  responseTime: number;
  correct: boolean;
};

type Question = {
  id: string;
  type: "vocabulary" | "grammar" | "writing";
  question: string;
  options?: string[];
  correctAnswer?: number;
  correctAnswerText?: string;
  alternatives?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, answers } = body as {
      questions: Question[];
      answers: Answer[];
    };

    if (!questions || !answers || questions.length !== answers.length) {
      return NextResponse.json({ error: "Invalid test data" }, { status: 400 });
    }

    // Calculate scores by category
    const vocabAnswers = answers.filter(
      (a, i) => questions[i].type === "vocabulary"
    );
    const grammarAnswers = answers.filter(
      (a, i) => questions[i].type === "grammar"
    );
    const writingAnswers = answers.filter(
      (a, i) => questions[i].type === "writing"
    );

    // Check writing answers (simple string matching for now)
    const writingResults = writingAnswers.map((answer, idx) => {
      const question = questions.find(
        (q) => q.type === "writing" && q.id === answer.questionId
      );
      if (!question) return false;

      const userAnswer = (answer.answer as string).toLowerCase().trim();
      const correctAnswer =
        question.correctAnswerText?.toLowerCase().trim() || "";
      const alternatives =
        question.alternatives?.map((a) => a.toLowerCase().trim()) || [];

      // Check if answer matches correct answer or alternatives
      return (
        userAnswer === correctAnswer ||
        alternatives.some(
          (alt) => userAnswer.includes(alt) || alt.includes(userAnswer)
        )
      );
    });

    // Update writing answers with correct results
    writingAnswers.forEach((answer, idx) => {
      answer.correct = writingResults[idx];
    });

    // Calculate category scores
    const vocabScore = Math.round(
      (vocabAnswers.filter((a) => a.correct).length / vocabAnswers.length) * 100
    );
    const grammarScore = Math.round(
      (grammarAnswers.filter((a) => a.correct).length / grammarAnswers.length) *
        100
    );
    const writingScore = Math.round(
      (writingResults.filter((r) => r).length / writingResults.length) * 100
    );

    // Calculate accuracy
    const totalCorrect = answers.filter((a) => a.correct).length;
    const accuracy = totalCorrect / answers.length;

    // Calculate average speed
    const totalResponseTime = answers.reduce(
      (sum, a) => sum + a.responseTime,
      0
    );
    const avgSpeed = totalResponseTime / answers.length;

    // Calculate speed score (faster = higher score, max 5 seconds)
    const speedScore = Math.max(0, (5 - avgSpeed) / 5);

    // Final score: 70% accuracy + 30% speed
    const finalScore = Math.round((accuracy * 0.7 + speedScore * 0.3) * 100);

    // Calculate total score (average of category scores)
    const totalScore = Math.round(
      (vocabScore + grammarScore + writingScore) / 3
    );

    // Determine overall level
    let overallLevel = "Beginner";
    if (totalScore >= 80) overallLevel = "Advanced";
    else if (totalScore >= 60) overallLevel = "Intermediate";
    else if (totalScore >= 40) overallLevel = "Elementary";

    // Get percentile (simplified - in production, calculate from all test results)
    const allResults = await prisma.levelTestResult.findMany({
      select: { totalScore: true },
    });

    const percentile =
      allResults.length > 0
        ? Math.round(
            (allResults.filter((r) => r.totalScore < totalScore).length /
              allResults.length) *
              100
          )
        : 50;

    // Get or create user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // If no user, we need to handle this case
    // Option 1: Create a temporary anonymous user
    // Option 2: Make userId optional in schema (requires migration)
    // For now, we'll use a workaround: create result only if user exists
    // or create a system user for anonymous results

    if (!userId) {
      // For anonymous users, we'll still save the result but need a valid userId
      // In production, you might want to create a system/anonymous user
      // or make userId optional in the schema
      return NextResponse.json(
        { error: "User authentication required to save results" },
        { status: 401 }
      );
    }

    // Save result to database
    const result = await prisma.levelTestResult.create({
      data: {
        userId: userId,
        vocabScore,
        grammarScore,
        writingScore,
        totalScore,
        avgSpeed,
        rankPercent: percentile,
        overallLevel,
        strengths: getStrengths(vocabScore, grammarScore, writingScore),
        weaknesses: getWeaknesses(vocabScore, grammarScore, writingScore),
        recommendedRoutine: getRecommendedRoutine(overallLevel),
      },
    });

    return NextResponse.json({
      success: true,
      resultId: result.id,
      score: totalScore,
      vocabScore,
      grammarScore,
      writingScore,
      accuracy,
      avgSpeed,
      percentile,
      overallLevel,
    });
  } catch (error) {
    console.error("❌ 테스트 제출 실패:", error);
    return NextResponse.json(
      { error: "테스트를 제출하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function getStrengths(vocab: number, grammar: number, writing: number): string {
  const strengths: string[] = [];
  if (vocab >= 70) strengths.push("어휘력");
  if (grammar >= 70) strengths.push("문법");
  if (writing >= 70) strengths.push("작문");
  return strengths.length > 0 ? strengths.join(", ") : "기초 실력";
}

function getWeaknesses(
  vocab: number,
  grammar: number,
  writing: number
): string {
  const weaknesses: string[] = [];
  if (vocab < 50) weaknesses.push("어휘력");
  if (grammar < 50) weaknesses.push("문법");
  if (writing < 50) weaknesses.push("작문");
  return weaknesses.length > 0 ? weaknesses.join(", ") : "없음";
}

function getRecommendedRoutine(level: string): string {
  const routines: Record<string, string> = {
    Beginner: "기초 문법과 일상 회화 루틴",
    Elementary: "기초 문법 심화와 표현 확장 루틴",
    Intermediate: "중급 문법과 비즈니스 영어 루틴",
    Advanced: "고급 문법과 전문 영어 루틴",
  };
  return routines[level] || "맞춤형 학습 루틴";
}
