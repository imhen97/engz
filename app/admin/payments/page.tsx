import prisma from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import { requireAdmin } from "@/lib/admin";
import { getStripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

async function getStripeSubscriptions() {
  try {
    const stripe = getStripe();

    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      expand: ["data.customer"],
    });

    return subscriptions.data.map((sub) => ({
      id: sub.id,
      customerId:
        typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
      customerEmail:
        typeof sub.customer === "object" && sub.customer
          ? (sub.customer as any).email
          : null,
      status: sub.status,
      plan: sub.items.data[0]?.price?.nickname || "Unknown",
      amount: sub.items.data[0]?.price?.unit_amount
        ? (sub.items.data[0].price.unit_amount / 100).toLocaleString("ko-KR")
        : "-",
      currency: sub.items.data[0]?.price?.currency?.toUpperCase() || "KRW",
      currentPeriodStart: new Date((sub as any).current_period_start * 1000),
      currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
    }));
  } catch (error) {
    console.error("Stripe API error:", error);
    return [];
  }
}

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const stripeSubscriptions = await getStripeSubscriptions();
  const localUsers = await prisma.user.findMany({
    where: {
      subscriptionActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      subscriptionId: true,
      stripeCustomerId: true,
      plan: true,
    },
  });

  // Merge local and Stripe data
  const paymentData = localUsers.map((user) => {
    const stripeSub = stripeSubscriptions.find(
      (sub) => sub.customerId === user.stripeCustomerId
    );
    return {
      ...user,
      stripeStatus: stripeSub?.status || "unknown",
      stripePlan: stripeSub?.plan || user.plan,
      amount: stripeSub?.amount || "-",
      renewalDate: stripeSub?.currentPeriodEnd || null,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">결제 관리</h1>
        <p className="mt-1 text-sm text-gray-600">
          Stripe 구독 및 결제 내역을 확인하세요.
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>
          💡 Stripe 대시보드에서 더 자세한 정보를 확인할 수 있습니다.{" "}
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            Stripe 대시보드 열기
          </a>
        </p>
      </div>

      <DataTable
        data={paymentData}
        columns={[
          { key: "name", label: "사용자" },
          { key: "email", label: "이메일" },
          {
            key: "stripePlan",
            label: "플랜",
            render: (value) => {
              const planMap: Record<string, string> = {
                monthly: "월간",
                annual: "연간",
              };
              return planMap[value] || value;
            },
          },
          {
            key: "stripeStatus",
            label: "상태",
            render: (value) => {
              const statusMap: Record<string, string> = {
                active: "활성",
                canceled: "취소됨",
                past_due: "연체",
                trialing: "체험 중",
                unknown: "알 수 없음",
              };
              return statusMap[value] || value;
            },
          },
          {
            key: "amount",
            label: "금액",
            render: (value) => (value !== "-" ? `₩${value}` : "-"),
          },
          {
            key: "renewalDate",
            label: "갱신일",
            render: (value) =>
              value ? new Date(value).toLocaleDateString("ko-KR") : "-",
          },
        ]}
        searchable
        searchPlaceholder="사용자 이름 또는 이메일로 검색..."
      />
    </div>
  );
}
