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
  try {
    const [
      totalUsers,
      activeSubscriptions,
      trialUsers,
      levelTestResults,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.user.count({
        where: { subscriptionActive: true },
      }).catch(() => 0),
      prisma.user.count({
        where: {
          trialActive: true,
          trialEndsAt: { gte: new Date() },
        },
      }).catch(() => 0),
      prisma.levelTestResult.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }).catch(() => []),
      prisma.log.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
    ]);

    // Calculate average level score
    const avgLevelScore =
      levelTestResults.length > 0
        ? levelTestResults.reduce((sum, result) => sum + result.totalScore, 0) /
          levelTestResults.length
        : 0;

    // User growth data (last 6 months) - simplified approach
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let userGrowth: Array<{ createdAt: Date; _count: number }> = [];
    try {
      // Get users created in last 6 months
      const recentUsers = await prisma.user.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Group by month
      const monthlyGroups = new Map<string, number>();
      recentUsers.forEach((user) => {
        const monthKey = new Date(user.createdAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "short",
        });
        monthlyGroups.set(monthKey, (monthlyGroups.get(monthKey) || 0) + 1);
      });

      userGrowth = Array.from(monthlyGroups.entries()).map(([month, count]) => ({
        createdAt: new Date(month),
        _count: count,
      }));
    } catch (error) {
      console.error("Error fetching user growth:", error);
      userGrowth = [];
    }

    return {
      totalUsers,
      activeSubscriptions,
      trialUsers,
      avgLevelScore: Math.round(avgLevelScore),
      recentLogs,
      userGrowth,
      levelTestResults,
    };
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    // Return default values if there's an error
    return {
      totalUsers: 0,
      activeSubscriptions: 0,
      trialUsers: 0,
      avgLevelScore: 0,
      recentLogs: [],
      userGrowth: [],
      levelTestResults: [],
    };
  }
}
