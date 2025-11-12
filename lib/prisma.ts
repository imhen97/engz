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

// 데이터베이스 연결 테스트
prisma.$connect().catch((error) => {
  console.error("❌ Prisma 데이터베이스 연결 실패:", error);
});

export default prisma;
