"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Point = { month: string; value: number };

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

export default function RevenueOverviewChart({
  months,
  values,
}: {
  months: string[];
  values: number[];
}) {
  const data: Point[] = months.map((m, i) => ({ month: m, value: values[i] ?? 0 }));

  return (
    <div className="h-[280px] w-full text-orange-600">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="currentColor" stopOpacity={0.18} />
              <stop offset="95%" stopColor="currentColor" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickFormatter={(v) => formatCompact(Number(v))}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            formatter={(v: any) => [`${Number(v).toLocaleString()}`, "Revenue"]}
            labelFormatter={(l) => `Month: ${l}`}
          />

          <Area type="monotone" dataKey="value" stroke="currentColor" strokeWidth={2.5} fill="url(#revFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
