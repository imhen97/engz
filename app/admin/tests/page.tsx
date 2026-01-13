import prisma from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ChartCard from "@/components/admin/ChartCard";
import { requireAdmin } from "@/lib/admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const dynamic = 'force-dynamic';

export default async function AdminTestsPage() {
  await requireAdmin();

  const tests = await prisma.levelTestResult.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Score distribution data
  const scoreRanges = [
    { range: "0-20", count: 0 },
    { range: "21-40", count: 0 },
    { range: "41-60", count: 0 },
    { range: "61-80", count: 0 },
    { range: "81-100", count: 0 },
  ];

  tests.forEach((test) => {
    const score = test.totalScore;
    if (score <= 20) scoreRanges[0].count++;
    else if (score <= 40) scoreRanges[1].count++;
    else if (score <= 60) scoreRanges[2].count++;
    else if (score <= 80) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">레벨테스트 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          AI 레벨테스트 결과를 모니터링하고 분석하세요.
        </p>
      </div>

      {/* Score Distribution Chart */}
      <ChartCard title="점수 분포">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreRanges}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#FF6B3D" name="사용자 수" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tests Table */}
      <DataTable
        data={tests}
        columns={[
          {
            key: "user",
            label: "사용자",
            render: (value) => value?.name || value?.email || "-",
          },
          {
            key: "vocabScore",
            label: "어휘",
          },
          {
            key: "grammarScore",
            label: "문법",
          },
          {
            key: "writingScore",
            label: "작문",
          },
          {
            key: "totalScore",
            label: "총점",
            render: (value) => `${value}점`,
          },
          {
            key: "avgSpeed",
            label: "평균 속도",
            render: (value) => (value ? `${value.toFixed(1)}초` : "-"),
          },
          {
            key: "rankPercent",
            label: "순위",
            render: (value) => (value ? `상위 ${value}%` : "-"),
          },
          {
            key: "overallLevel",
            label: "레벨",
          },
          {
            key: "createdAt",
            label: "날짜",
            render: (value) => new Date(value).toLocaleDateString("ko-KR"),
          },
        ]}
        searchable
        searchPlaceholder="사용자 이름 또는 이메일로 검색..."
      />
    </div>
  );
}
