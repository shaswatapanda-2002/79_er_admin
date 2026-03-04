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
import { Download, Users, Building2, DollarSign, Percent, Loader2 } from "lucide-react";
import { useAnalyticsOverviewQuery } from "@/src/queries/analytics.queries";

function fmtMoneyShort(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function fmtMoneyFull(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtDelta(pct: number) {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% vs last month`;
}

function monthLabel(yyyymm: string) {
  if (!yyyymm) return "";
  const [y, m] = String(yyyymm).split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString(undefined, { month: "short" }); // Aug, Sep...
}

function yTick(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
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
  const isNegative = delta.trim().startsWith("-");
  return (
    <Card className="rounded-xl border bg-white shadow-sm">
      <CardContent className="p-4 flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold leading-6">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
          <div className={`text-[11px] mt-2 ${isNegative ? "text-red-600" : "text-green-600"}`}>
            {delta}
          </div>
        </div>

        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

const pieColors = ["#3B82F6", "#8B5CF6", "#9CA3AF", "#10B981", "#F59E0B", "#EF4444"];

export default function AnalyticsClient() {
  const overviewQ = useAnalyticsOverviewQuery();

  const loading = overviewQ.isLoading;
  const errorMsg = (overviewQ.error as any)?.message || null;

  const d = overviewQ.data?.data;

  const growthTrend =
    d?.charts?.userGrowthTrend?.map((x) => ({
      month: x.month,
      total: x.totalUsers,
      active: x.activeUsers,
    })) || [];

  // ✅ Revenue breakdown: grouped per month (App vs Agency)
  const revenueBreakdown =
    d?.charts?.revenueBreakdown?.map((x) => ({
      month: x.month,
      b2c: x.customerRevenue,
      b2b: x.agencyRevenue,
    })) || [];

  // ✅ filter "none" (and empty)
  const subscriptionDistribution =
    d?.charts?.subscriptionDistribution
      ?.filter((x) => {
        const p = (x.plan || "").toLowerCase().trim();
        return p && p !== "none";
      })
      .map((x) => ({ name: x.plan, value: x.count })) || [];

  // ✅ Agency performance: grouped bars (Agency Count vs Revenue)
  const agencyPerformance =
    d?.charts?.agencyPerformanceByPlan
      ?.filter((x) => {
        const p = (x.planKey || "").toLowerCase().trim();
        return p && p !== "none";
      })
      .map((x) => ({
        plan: x.planKey,
        agencies: x.agencyCount,
        revenue: x.revenue,
      })) || [];

  function exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      overview: d || null,
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

  const cards = d?.cards;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Analytics &amp; Reports</div>
          <div className="text-sm text-muted-foreground">Insights into platform performance and growth</div>
        </div>

        <Button
          onClick={exportReport}
          className="rounded-xl bg-orange-600 hover:bg-orange-600 gap-2"
          disabled={loading || !d}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export Report
        </Button>
      </div>

      {errorMsg ? (
        <div className="rounded-xl border p-3 text-sm text-red-600 bg-red-50">{errorMsg}</div>
      ) : null}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard
          value={loading ? "…" : (cards?.totalUsers?.value ?? 0).toLocaleString()}
          label="Total Users"
          delta={loading ? "…" : fmtDelta(cards?.totalUsers?.growthPct ?? 0)}
          icon={<Users className="h-4 w-4 text-blue-600" />}
        />
        <StatCard
          value={loading ? "…" : (cards?.activeAgencies?.value ?? 0).toLocaleString()}
          label="Active Agencies"
          delta={loading ? "…" : fmtDelta(cards?.activeAgencies?.growthPct ?? 0)}
          icon={<Building2 className="h-4 w-4 text-purple-600" />}
        />
        <StatCard
          value={loading ? "…" : fmtMoneyShort(cards?.monthlyRevenue?.value ?? 0)}
          label="Monthly Revenue"
          delta={loading ? "…" : fmtDelta(cards?.monthlyRevenue?.growthPct ?? 0)}
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
        />
        <StatCard
          value={loading ? "…" : `${(cards?.conversionRate?.value ?? 0).toFixed(2)}%`}
          label="Conversion Rate"
          delta={loading ? "…" : fmtDelta(cards?.conversionRate?.growthPct ?? 0)}
          icon={<Percent className="h-4 w-4 text-indigo-600" />}
        />
      </div>

      {/* User Growth Trend */}
      <Card className="rounded-xl border bg-white">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-3">User Growth Trend</div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrend} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={monthLabel} />
                <YAxis />
                <Tooltip labelFormatter={(l) => monthLabel(String(l))} />
                <Legend verticalAlign="bottom" align="center" />
                <Line type="monotone" dataKey="total" name="Total Users" dot />
                <Line type="monotone" dataKey="active" name="Active Users" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue + Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* ✅ Revenue Breakdown (like screenshot) */}
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-3">Revenue Breakdown</div>

            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueBreakdown}
                  margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                  barCategoryGap={18}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={monthLabel}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={yTick}
                  />
                  <Tooltip
                    formatter={(v: any) => fmtMoneyFull(Number(v))}
                    labelFormatter={(l) => monthLabel(String(l))}
                  />
                  <Legend verticalAlign="bottom" align="center" />
                  <Bar dataKey="b2c" name="App (B2C)" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="b2b" name="Agency (B2B)" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-4">
            <div className="text-sm font-semibold mb-3">Subscription Distribution</div>

            <div className="h-[230px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={subscriptionDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {subscriptionDistribution.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {subscriptionDistribution.length === 0 ? (
              <div className="text-xs text-muted-foreground mt-2 text-center">No subscription data.</div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* ✅ Agency Performance by Plan (GROUPED like revenue breakdown) */}
      <Card className="rounded-xl border bg-white">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-3">Agency Performance by Plan</div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agencyPerformance}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                barCategoryGap={18}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" />
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
                <Tooltip
                  formatter={(v: any, name: any) => {
                    if (String(name).toLowerCase().includes("revenue")) {
                      return fmtMoneyFull(Number(v));
                    }
                    return String(v);
                  }}
                />
                <Legend verticalAlign="bottom" align="center" />
                <Bar
                  dataKey="agencies"
                  name="Agency Count"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {agencyPerformance.length === 0 ? (
            <div className="text-xs text-muted-foreground mt-2 text-center">No agency plan data.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}