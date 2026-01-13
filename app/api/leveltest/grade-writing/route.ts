import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import type { WritingGradingRequest, WritingGradingResponse, ApiResponse } from "@/types";

// Lazy initialization to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface OpenAIResponse {
  grammar?: number;
  structure?: number;
  vocabulary?: number;
  fluency?: number;
  overall?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WritingGradingRequest;
    const { prompts } = body;

    if (!prompts || !Array.isArray(prompts)) {
      const errorResponse: ApiResponse<never> = {
        success: false,
        error: "Invalid prompts array",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const scores: number[] = [];

    // Check API key before initializing client
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ OPENAI_API_KEY not configured, using default scores");
      // Return default scores if API key is not configured
      const defaultResponse: WritingGradingResponse = {
        scores: prompts.map(() => 50),
      };
      return NextResponse.json(defaultResponse);
    }

    const openai = getOpenAIClient();

    for (const item of prompts) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                'You are an English proficiency grader. Grade the following answer on grammar, sentence structure, vocabulary range, and fluency (1-10 each). Return ONLY a JSON object with the format: {"grammar": 7, "structure": 6, "vocabulary": 8, "fluency": 7, "overall": 7}. The overall score should be the average of the four scores.',
            },
            {
              role: "user",
              content: `Prompt: "${item.prompt}"\n\nAnswer: "${item.answer}"\n\nGrade this answer and return JSON only.`,
            },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        const grading = JSON.parse(
          response.choices[0].message.content || "{}"
        ) as OpenAIResponse;
        const overallScore =
          grading.overall ||
          Math.round(
            ((grading.grammar || 0) +
              (grading.structure || 0) +
              (grading.vocabulary || 0) +
              (grading.fluency || 0)) /
              4
          );
        scores.push(Math.min(100, overallScore * 10)); // Convert 1-10 to 0-100
      } catch (error) {
        console.error("OpenAI grading error:", error);
        // Default score if grading fails
        scores.push(50);
      }
    }

    const response: WritingGradingResponse = { scores };
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Writing 채점 실패:", error);
    const errorResponse: ApiResponse<never> = {
      success: false,
      error: "Writing을 채점하는 중 오류가 발생했습니다.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
