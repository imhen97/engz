"use client";

import { useState } from "react";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mock environment variables (in production, these should come from API)
  const envVars = [
    { key: "STRIPE_SECRET_KEY", value: "sk_***", masked: true },
    { key: "OPENAI_API_KEY", value: "sk-***", masked: true },
    { key: "DATABASE_URL", value: "postgresql://***", masked: true },
    { key: "NEXTAUTH_SECRET", value: "***", masked: true },
  ];

  // Mock logs (in production, fetch from API)
  const logs = [
    {
      id: "1",
      type: "login",
      message: "Admin user logged in",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "payment",
      message: "New subscription created",
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="mt-1 text-sm text-gray-600">
          시스템 설정 및 환경 변수를 관리하세요.
        </p>
      </div>

      {/* Environment Variables */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">환경 변수</h3>
        <div className="space-y-3">
          {envVars.map((env) => (
            <div
              key={env.key}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
            >
              <div>
                <p className="font-medium text-gray-900">{env.key}</p>
                <p className="text-sm text-gray-500">{env.value}</p>
              </div>
              <button className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">
                수정
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-500">
          ⚠️ 환경 변수는 실제로는 서버 환경에서만 수정 가능합니다.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">가격 플랜</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900">월간 플랜</h4>
            <p className="mt-2 text-2xl font-bold text-[#FF6B3D]">₩49,000</p>
            <button className="mt-3 rounded-lg bg-[#FF6B3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF6B3D]/90">
              수정
            </button>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900">연간 플랜</h4>
            <p className="mt-2 text-2xl font-bold text-[#FF6B3D]">₩39,000</p>
            <button className="mt-3 rounded-lg bg-[#FF6B3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF6B3D]/90">
              수정
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              유지보수 모드
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              사이트를 일시적으로 비활성화합니다.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#FF6B3D] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B3D]/20"></div>
          </label>
        </div>
      </div>

      {/* Log Viewer */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">로그 뷰어</h3>
        <DataTable
          data={logs}
          columns={[
            { key: "type", label: "유형" },
            { key: "message", label: "메시지" },
            {
              key: "createdAt",
              label: "시간",
              render: (value) => new Date(value).toLocaleString("ko-KR"),
            },
          ]}
        />
      </div>
    </div>
  );
}
