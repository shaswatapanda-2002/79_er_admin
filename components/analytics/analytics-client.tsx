"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Users, Building2, DollarSign, Percent } from "lucide-react";
import {
  kpis,
  growthTrend,
  revenueBreakdown,
  subscriptionDistribution,
  agencyPerformance,
} from "./mock";

function fmtMoney(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function fmtMoneyFull(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function StatCard({
  icon,
  value,
  label,
  delta,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta: string;
}) {
  return (
    <Card className="rounded-xl border bg-white shadow-sm">
      <CardContent className="p-4 flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold leading-6">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
          <div className="text-[11px] mt-2 text-green-600">{delta}</div>
        </div>

        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsClient() {
  function exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      kpis,
      growthTrend,
      revenueBreakdown,
      subscriptionDistribution,
      agencyPerformance,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-report.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  // small palette (avoid hardcoding lots of colors, just minimal for pie segments)
  const pieColors = ["#3B82F6", "#8B5CF6", "#9CA3AF"]; // blue / purple / gray

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Analytics &amp; Reports</div>
          <div className="text-sm text-muted-foreground">
            Insights into platform performance and growth
          </div>
        </div>

        <Button
          onClick={exportReport}
          className="rounded-xl bg-orange-600 hover:bg-orange-600 gap-2"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard
          value={kpis.totalUsers.toLocaleString()}
          label="Total Users"
          delta={kpis.totalUsersDelta}
          icon={<Users className="h-4 w-4 text-blue-600" />}
        />
        <StatCard
          value={kpis.activeAgencies.toLocaleString()}
          label="Active Agencies"
          delta={kpis.activeAgenciesDelta}
          icon={<Building2 className="h-4 w-4 text-purple-600" />}
        />
        <StatCard
          value={fmtMoney(kpis.monthlyRevenue)}
          label="Monthly Revenue"
          delta={kpis.monthlyRevenueDelta}
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
        />
        <StatCard
          value={`${kpis.conversionRate.toFixed(1)}%`}
          label="Conversion Rate"
          delta={kpis.conversionRateDelta}
          icon={<Percent className="h-4 w-4 text-indigo-600" />}
        />
      </div>

      {/* User Growth Trend */}
      <Card className="rounded-xl border bg-white">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-3">User Growth Trend</div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total Users" dot />
                <Line
                  type="monotone"
                  dataKey="active"
                  name="Active Users"
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue + Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-3">Revenue Breakdown</div>

            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueBreakdown}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip formatter={(v: any) => fmtMoneyFull(Number(v))} />
                  <Legend />
                  <Bar
                    dataKey="b2c"
                    name="App (B2C)"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="b2b"
                    name="Agency (B2B)"
                    fill="#8B5CF6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white">
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-3">
              Subscription Distribution
            </div>

            <div className="h-[230px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={subscriptionDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {subscriptionDistribution.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agency Performance */}
      <Card className="rounded-xl border bg-white">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-3">
            Agency Performance by Plan
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agencyPerformance}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="plan"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="agencies"
                  name="Agency Count"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue ($K)"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
