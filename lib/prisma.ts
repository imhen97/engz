import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

const prisma =
  global.cachedPrisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma;
}

// 데이터베이스 연결 테스트 (비동기로 실행, 에러가 발생해도 앱이 크래시되지 않도록)
if (typeof window === "undefined") {
  // 서버 사이드에서만 실행
  prisma.$connect().catch((error) => {
    console.error("❌ Prisma 데이터베이스 연결 실패:", error);
    // 연결 실패해도 앱이 크래시되지 않도록 함
  });
}

export default prisma;
