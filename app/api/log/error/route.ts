import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, stack, componentStack, digest, timestamp, url } = body;

    // Log error to database
    await prisma.log.create({
      data: {
        type: "error",
        message: message || "Unknown error",
        metadata: JSON.stringify({
          stack,
          componentStack,
          digest,
          timestamp,
          url,
          userAgent: request.headers.get("user-agent"),
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't throw errors from error logging endpoint
    console.error("Failed to log error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log error" },
      { status: 500 }
    );
  }
}
