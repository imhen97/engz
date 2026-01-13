import prisma from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import { requireAdmin } from "@/lib/admin";

export const dynamic = 'force-dynamic';

export default async function AdminFeedbackPage() {
  await requireAdmin();

  const feedbackData = await prisma.levelTestResult.findMany({
    where: {
      aiFeedback: { not: null },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 피드백 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          AI가 생성한 학습 피드백을 검토하고 관리하세요.
        </p>
      </div>

      <DataTable
        data={feedbackData}
        columns={[
          {
            key: "user",
            label: "사용자",
            render: (value) => {
              if (value && typeof value === "object" && "name" in value) {
                const user = value as { name: string | null; email: string | null };
                return user.name || user.email || "-";
              }
              return "-";
            },
          },
          {
            key: "overallLevel",
            label: "레벨",
          },
          {
            key: "aiFeedback",
            label: "AI 피드백",
            render: (value) => {
              if (typeof value === "string" && value) {
                return (
                  <div className="max-w-md truncate" title={value}>
                    {value.substring(0, 100)}...
                  </div>
                );
              }
              return "-";
            },
          },
          {
            key: "recommendedRoutine",
            label: "추천 루틴",
            render: (value) => {
              if (typeof value === "string" && value) {
                return value;
              }
              return "-";
            },
          },
          {
            key: "createdAt",
            label: "날짜",
            render: (value) => {
              if (value instanceof Date) {
                return value.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
              if (typeof value === "string") {
                return new Date(value).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
              return "-";
            },
          },
        ]}
        searchable
        searchPlaceholder="피드백 내용으로 검색..."
        onRowClick={(row) => {
          // Open feedback detail modal (can be implemented later)
          console.log("View feedback:", row);
        }}
      />
    </div>
  );
}
