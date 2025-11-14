import prisma from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import { requireAdmin } from "@/lib/admin";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      trialActive: true,
      trialEndsAt: true,
      subscriptionActive: true,
      createdAt: true,
      levelTestResults: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { overallLevel: true },
      },
    },
  });

  const getSubscriptionStatus = (user: any) => {
    if (user.subscriptionActive) return "구독 중";
    if (
      user.trialActive &&
      user.trialEndsAt &&
      new Date(user.trialEndsAt) > new Date()
    ) {
      return "체험 중";
    }
    return "만료";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          등록된 모든 학습자를 관리하고 모니터링하세요.
        </p>
      </div>

      <DataTable
        data={users}
        columns={[
          { key: "name", label: "이름" },
          { key: "email", label: "이메일" },
          {
            key: "levelTestResults",
            label: "레벨",
            render: (value) =>
              value && value.length > 0 ? value[0].overallLevel : "미측정",
          },
          {
            key: "plan",
            label: "플랜",
            render: (value) => {
              const planMap: Record<string, string> = {
                free: "무료",
                monthly: "월간",
                annual: "연간",
              };
              return planMap[value] || value;
            },
          },
          {
            key: "subscriptionActive",
            label: "구독 상태",
            render: (_, row) => getSubscriptionStatus(row),
          },
          {
            key: "trialEndsAt",
            label: "체험 종료일",
            render: (value) =>
              value ? new Date(value).toLocaleDateString("ko-KR") : "-",
          },
          {
            key: "createdAt",
            label: "가입일",
            render: (value) => new Date(value).toLocaleDateString("ko-KR"),
          },
        ]}
        searchable
        searchPlaceholder="이름 또는 이메일로 검색..."
      />
    </div>
  );
}
