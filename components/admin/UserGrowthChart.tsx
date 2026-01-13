"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type UserGrowthData = {
  month: string;
  users: number;
};

type UserGrowthChartProps = {
  data: UserGrowthData[];
};

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
  );
}
