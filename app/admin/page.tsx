import { getAdminStats } from "@/lib/admin";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable from "@/components/admin/DataTable";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import TestCompletionChart from "@/components/admin/TestCompletionChart";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  // Prepare user growth data
  const userGrowthData = stats.userGrowth.map((item) => ({
    month: item.createdAt instanceof Date 
      ? item.createdAt.toLocaleDateString("ko-KR", { month: "short" })
      : new Date(item.createdAt).toLocaleDateString("ko-KR", { month: "short" }),
    users: item._count,
  }));

  // Prepare test completion data
  const testCompletionData = [
    { name: "완료", value: stats.levelTestResults.length },
    {
      name: "미완료",
      value: Math.max(0, stats.totalUsers - stats.levelTestResults.length),
    },
  ];

  const COLORS = ["#FF6B3D", "#94A3B8"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드 개요</h1>
        <p className="mt-1 text-sm text-gray-600">
          ENGZ 플랫폼 전체 통계를 한눈에 확인하세요.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 사용자"
          value={stats.totalUsers.toLocaleString()}
          icon="👥"
        />
        <StatCard
          title="활성 구독"
          value={stats.activeSubscriptions.toLocaleString()}
          icon="💳"
        />
        <StatCard
          title="체험 사용자"
          value={stats.trialUsers.toLocaleString()}
          icon="🎁"
        />
        <StatCard
          title="평균 레벨 점수"
          value={stats.avgLevelScore}
          icon="⭐"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="사용자 성장 추이">
          <UserGrowthChart data={userGrowthData} />
        </ChartCard>

        <ChartCard title="테스트 완료율">
          <TestCompletionChart data={testCompletionData} colors={COLORS} />
        </ChartCard>
      </div>

      {/* Recent Logs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          최근 활동 로그
        </h3>
        <DataTable
          data={stats.recentLogs}
          columns={[
            { key: "type", label: "유형" },
            {
              key: "message",
              label: "메시지",
            },
            {
              key: "createdAt",
              label: "시간",
              render: (value) => {
                if (!value) return "-";
                if (value instanceof Date) {
                  return value.toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
                if (typeof value === "string") {
                  return new Date(value).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
                return "-";
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
