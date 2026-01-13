import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/prisma";
import { getAuthToken } from "@/lib/api-handler";

export const dynamic = 'force-dynamic';

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Helper to calculate letter grade from score
function getGrade(score: number): string {
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

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken(request);
    
    if (!token?.userId) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const userId = token.userId as string;
    const formData = await request.formData();
    
    const missionId = formData.get("missionId") as string;
    const mode = formData.get("mode") as string;
    const text = formData.get("text") as string | null;
    const audio = formData.get("audio") as File | null;

    if (!missionId) {
      return NextResponse.json({ error: "미션 ID가 필요합니다." }, { status: 400 });
    }

    // Verify mission exists and belongs to user's routine
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        routine: true,
      },
    });

    if (!mission) {
      return NextResponse.json({ error: "미션을 찾을 수 없습니다." }, { status: 404 });
    }

    if (mission.routine.userId !== userId) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    let userResponse = text || "";

    // If audio mode, we would normally transcribe the audio here
    // For now, we'll use a placeholder or the text if provided
    if (mode === "recording" && audio) {
      // In production, you would:
      // 1. Save audio to cloud storage (e.g., Supabase, S3)
      // 2. Use OpenAI Whisper API to transcribe
      // For now, we'll use a mock response
      userResponse = "[음성 녹음 제출됨 - Whisper API 연동 필요]";
      
      // Uncomment below for actual Whisper integration:
      // const openai = getOpenAI();
      // const transcription = await openai.audio.transcriptions.create({
      //   file: audio,
      //   model: "whisper-1",
      // });
      // userResponse = transcription.text;
    }

    if (!userResponse.trim()) {
      return NextResponse.json({ error: "답변이 필요합니다." }, { status: 400 });
    }

    // Generate AI feedback using OpenAI
    const openai = getOpenAI();
    
    const prompt = `You are an English language coach. A student has completed a learning mission.

Mission: ${mission.content}

Student's response: "${userResponse}"

Please evaluate the student's response and provide feedback in JSON format:
{
  "score": <number 0-100>,
  "grammarScore": <number 0-100>,
  "pronunciationScore": <number 0-100>,
  "fluencyScore": <number 0-100>,
  "corrections": [<list of specific corrections in Korean>],
  "suggestions": "<encouraging suggestion in Korean for improvement, 2-3 sentences>"
}

Scoring guidelines:
- 90-100: Excellent, native-like response
- 80-89: Good, minor issues
- 70-79: Acceptable, needs some work
- 60-69: Needs improvement
- Below 60: Needs significant work

Be encouraging but honest. Focus on practical improvements.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful English language coach. Always respond with valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const feedbackContent = completion.choices[0]?.message?.content;
    if (!feedbackContent) {
      throw new Error("AI 피드백 생성 실패");
    }

    const feedback = JSON.parse(feedbackContent);
    
    // Calculate overall score
    const overallScore = Math.round(
      (feedback.score + feedback.grammarScore + feedback.pronunciationScore + feedback.fluencyScore) / 4
    );

    // Update mission with feedback if score is high enough
    if (overallScore >= 90) {
      await prisma.mission.update({
        where: { id: missionId },
        data: {
          completed: true,
          aiFeedback: feedback.suggestions,
        },
      });

      // Update routine progress
      const routine = await prisma.routine.findUnique({
        where: { id: mission.routineId },
        include: {
          missions: true,
        },
      });

      if (routine) {
        const completedCount = routine.missions.filter(m => m.completed).length + 1; // +1 for the just completed mission
        const totalMissions = routine.missions.length;
        
        // If all missions are complete, mark routine as complete
        if (completedCount >= totalMissions) {
          await prisma.routine.update({
            where: { id: routine.id },
            data: { completed: true },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      score: overallScore,
      grammarScore: feedback.grammarScore,
      pronunciationScore: feedback.pronunciationScore,
      fluencyScore: feedback.fluencyScore,
      grammarGrade: getGrade(feedback.grammarScore),
      pronunciationGrade: getGrade(feedback.pronunciationScore),
      fluencyGrade: getGrade(feedback.fluencyScore),
      corrections: feedback.corrections || [],
      suggestions: feedback.suggestions,
      missionCompleted: overallScore >= 90,
    });
  } catch (error) {
    console.error("Mission submit error:", error);
    return NextResponse.json(
      { error: "미션 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
