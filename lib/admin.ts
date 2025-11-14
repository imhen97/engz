import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "./prisma";
import { redirect } from "next/navigation";

/**
 * Check if the current user is an admin
 * Throws redirect if not authenticated or not admin
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    redirect("/admin/login?error=unauthorized");
  }

  return session;
}

/**
 * Get admin dashboard stats
 */
export async function getAdminStats() {
  const [
    totalUsers,
    activeSubscriptions,
    trialUsers,
    levelTestResults,
    recentLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { subscriptionActive: true },
    }),
    prisma.user.count({
      where: {
        trialActive: true,
        trialEndsAt: { gte: new Date() },
      },
    }),
    prisma.levelTestResult.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.log.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Calculate average level score
  const avgLevelScore =
    levelTestResults.length > 0
      ? levelTestResults.reduce((sum, result) => sum + result.totalScore, 0) /
        levelTestResults.length
      : 0;

  // User growth data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const userGrowth = await prisma.user.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: { gte: sixMonthsAgo },
    },
    _count: true,
  });

  return {
    totalUsers,
    activeSubscriptions,
    trialUsers,
    avgLevelScore: Math.round(avgLevelScore),
    recentLogs,
    userGrowth,
    levelTestResults,
  };
}
