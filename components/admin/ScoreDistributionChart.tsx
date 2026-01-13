"use client";

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

type ScoreRange = {
  range: string;
  count: number;
};

type ScoreDistributionChartProps = {
  data: ScoreRange[];
};

export default function ScoreDistributionChart({
  data,
}: ScoreDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#FF6B3D" name="사용자 수" />
      </BarChart>
    </ResponsiveContainer>
  );
}
