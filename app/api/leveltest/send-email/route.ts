import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_URL || "https://www.eng-z.com";

// Initialize nodemailer transporter
function getEmailTransporter() {
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
    return null;
  }

  try {
    // Parse EMAIL_SERVER (format: smtp://user:pass@smtp.example.com:587)
    const emailServer = process.env.EMAIL_SERVER;
    const url = new URL(emailServer);

    return nodemailer.createTransport({
      host: url.hostname,
      port: parseInt(url.port) || 587,
      secure: url.protocol === "smtps:",
      auth: {
        user: url.username,
        pass: url.password,
      },
    });
  } catch (error) {
    console.error("❌ 이메일 서버 설정 오류:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, resultId } = body;

    if (!email || !resultId) {
      return NextResponse.json(
        { error: "이메일과 결과 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // Check if user is logged in (optional, but preferred)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Fetch result from database
    let result;
    if (token?.userId) {
      // Logged in user - fetch from database
      result = await prisma.levelTestResult.findFirst({
        where: {
          id: resultId,
          userId: token.userId as string,
        },
      });
    } else {
      // Anonymous user - try to find by resultId (if it's a temp ID, this will fail)
      result = await prisma.levelTestResult.findUnique({
        where: { id: resultId },
      });
    }

    if (!result) {
      return NextResponse.json(
        { error: "결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Send email
    const transporter = getEmailTransporter();
    if (!transporter) {
      console.warn("⚠️ 이메일 서버가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "이메일 서버가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const resultUrl = `${APP_URL}/level-test/result`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B3D 0%, #FF905F 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; background: #FF6B3D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .score { background: #FFF2EA; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ENGZ AI 레벨 테스트 결과</h1>
            </div>
            <div class="content">
              <p>안녕하세요,</p>
              <p>ENGZ AI 레벨 테스트를 완료해 주셔서 감사합니다.</p>
              
              <div class="score">
                <h2>📊 테스트 결과 요약</h2>
                <p><strong>선택한 레벨:</strong> ${result.levelSelected}</p>
                <p><strong>종합 레벨:</strong> ${result.overallLevel}</p>
                <p><strong>어휘 점수:</strong> ${result.vocabScore}/10</p>
                <p><strong>문법 점수:</strong> ${result.grammarScore}/10</p>
                <p><strong>작문 점수:</strong> ${result.writingScore}/10</p>
              </div>

              ${
                result.strengths
                  ? `<p><strong>✅ 강점:</strong> ${result.strengths}</p>`
                  : ""
              }
              ${
                result.weaknesses
                  ? `<p><strong>⚠️ 개선 포인트:</strong> ${result.weaknesses}</p>`
                  : ""
              }

              <p>상세한 AI 피드백과 4주 맞춤 플랜을 확인하려면 아래 버튼을 클릭하세요.</p>
              
              <a href="${resultUrl}" class="button">결과 리포트 보기</a>
              
              <p>감사합니다,<br>ENGZ AI 팀</p>
            </div>
            <div class="footer">
              <p>이 이메일은 ENGZ AI 레벨 테스트 결과 요청에 따라 발송되었습니다.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "ENGZ AI 레벨 테스트 결과 리포트",
      html: emailHtml,
    });

    console.log("✅ 이메일 발송 완료:", email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ 이메일 발송 실패:", error);
    return NextResponse.json(
      { error: "이메일 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
