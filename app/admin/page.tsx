import { getAdminStats } from "@/lib/admin";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable from "@/components/admin/DataTable";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  // Prepare user growth data
  const userGrowthData = stats.userGrowth.map((item) => ({
    month: new Date(item.createdAt).toLocaleDateString("ko-KR", {
      month: "short",
    }),
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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#FF6B3D"
                strokeWidth={2}
                name="신규 사용자"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="테스트 완료율">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={testCompletionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {testCompletionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
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
              render: (value) =>
                new Date(value).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            },
          ]}
        />
      </div>
    </div>
  );
}
