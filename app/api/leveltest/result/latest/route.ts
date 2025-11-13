import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import OpenAI from "openai";

import prisma from "@/lib/prisma";

type LevelSummary = {
  levelSelected: string | null;
  vocabScore: number;
  grammarScore: number;
  writingScore: number;
  overallLevel: string;
  strengths: string | null;
  weaknesses: string | null;
  recommendedRoutine: string | null;
};

const LEVEL_LABELS: Record<string, { ko: string; en: string }> = {
  beginner: { ko: "기초 (Beginner)", en: "Beginner" },
  intermediate: { ko: "중급 (Intermediate)", en: "Intermediate" },
  advanced: { ko: "고급 (Advanced)", en: "Advanced" },
};

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function buildFallbackInsights(result: LevelSummary) {
  const levelKey = result.levelSelected || "intermediate";
  const levelInfo = LEVEL_LABELS[levelKey] ?? {
    ko: "맞춤형 레벨",
    en: levelKey,
  };

  const feedback = `${levelInfo.ko} 학습자에 맞춰 어휘, 문법, 작문 실력을 균형 있게 다듬어야 합니다. 점수 분포를 보면 어휘 ${result.vocabScore}점, 문법 ${result.grammarScore}점, 작문 ${result.writingScore}점으로 나타납니다. 강점은 ${result.strengths ?? "어휘 이해"}이며, 약점은 ${
    result.weaknesses ?? "자연스러운 문장 구성"
  }입니다.`;

  const planLines = [
    "Week 1: 핵심 문법 구조 복습과 필수 어휘 확장. 짧은 문장 말하기와 쓰기 연습을 병행하세요.",
    "Week 2: 실전 예문을 바탕으로 문장 변형 훈련을 진행하고, 매일 5분씩 셀프 스피킹을 녹음해 보세요.",
    "Week 3: 작문 집중 주간으로, 하루 한 편 쓰고 AI 피드백 혹은 튜터 피드백을 받아 수정합니다.",
    "Week 4: 실전 시나리오 롤플레이와 프레젠테이션 연습으로 말하기 자신감을 끌어올리세요.",
  ];

  return {
    feedback,
    planText: planLines.join("\n"),
  };
}

async function generateInsights(result: LevelSummary) {
  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackInsights(result);
  }

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "당신은 한국인 성인을 위한 프리미엄 영어 코칭 전문가입니다. 응답은 반드시 JSON 객체로 생성하세요. 구조는 {\"feedback\": \"...\", \"plan\": {\"week1\": \"...\", \"week2\": \"...\", \"week3\": \"...\", \"week4\": \"...\"}} 입니다. 한국어로 따뜻하고 구체적인 코칭 톤을 사용하세요. 점수와 결과를 참고해 학습 전략을 제안하고, 영어 문장을 예시로 1~2개 추가해도 좋습니다.",
        },
        {
          role: "user",
          content: `
English Level Test Summary:
- Level Selected: ${result.levelSelected || "Not specified (Gamified test)"}
- Overall Level: ${result.overallLevel}
- Vocabulary Score: ${result.vocabScore}/10
- Grammar Score: ${result.grammarScore}/10
- Writing Score: ${result.writingScore}/10
- Strengths: ${result.strengths ?? "N/A"}
- Weaknesses: ${result.weaknesses ?? "N/A"}
- Recommended Routine: ${result.recommendedRoutine ?? "N/A"}
`,
        },
      ],
    });

    const payload = JSON.parse(response.choices[0].message.content ?? "{}") as {
      feedback?: string;
      plan?: {
        week1?: string;
        week2?: string;
        week3?: string;
        week4?: string;
      };
    };

    const feedback =
      payload.feedback?.trim() ||
      buildFallbackInsights(result).feedback;

    const planLines = payload.plan
      ? [
          payload.plan.week1 ? `Week 1: ${payload.plan.week1}` : null,
          payload.plan.week2 ? `Week 2: ${payload.plan.week2}` : null,
          payload.plan.week3 ? `Week 3: ${payload.plan.week3}` : null,
          payload.plan.week4 ? `Week 4: ${payload.plan.week4}` : null,
        ].filter(Boolean)
      : null;

    const planText =
      planLines?.length ? planLines.join("\n") : buildFallbackInsights(result).planText;

    return { feedback, planText };
  } catch (error) {
    console.error("❌ AI feedback generation failed:", error);
    return buildFallbackInsights(result);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.userId as string;

    const latestResult = await prisma.levelTestResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    let aiFeedback = latestResult.aiFeedback;
    let aiPlan = latestResult.aiPlan;

    if (!aiFeedback || !aiPlan) {
      const insights = await generateInsights({
        levelSelected: latestResult.levelSelected,
        vocabScore: latestResult.vocabScore,
        grammarScore: latestResult.grammarScore,
        writingScore: latestResult.writingScore,
        overallLevel: latestResult.overallLevel,
        strengths: latestResult.strengths ?? null,
        weaknesses: latestResult.weaknesses ?? null,
        recommendedRoutine: latestResult.recommendedRoutine ?? null,
      });

      aiFeedback = insights.feedback;
      aiPlan = insights.planText;

      await prisma.levelTestResult.update({
        where: { id: latestResult.id },
        data: {
          aiFeedback,
          aiPlan,
        },
      });
    }

    return NextResponse.json({
      id: latestResult.id,
      levelSelected: latestResult.levelSelected,
      vocabScore: latestResult.vocabScore,
      grammarScore: latestResult.grammarScore,
      writingScore: latestResult.writingScore,
      overallLevel: latestResult.overallLevel,
      strengths: latestResult.strengths ?? "",
      weaknesses: latestResult.weaknesses ?? "",
      recommendedRoutine: latestResult.recommendedRoutine ?? "",
      aiFeedback,
      aiPlan,
      createdAt: latestResult.createdAt,
    });
  } catch (error) {
    console.error("❌ Latest level test result fetch failed:", error);
    return NextResponse.json(
      {
        error: "레벨 테스트 결과를 불러오는 중 문제가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}


