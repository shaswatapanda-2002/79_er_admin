"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Users,
  Building2,
  CreditCard,
  Ticket,
  Wallet,
  Activity,
} from "lucide-react";

import { MetricCard } from "@/components/common/metric-card";
import RevenueOverviewChart from "@/components/common/revenue-overview-chart";

import { useAdminDashboardQuery } from "@/src/queries/dashboard.queries";
import { mapAdminDashboardToUi, type MetricColor } from "@/lib/dashboard";

function iconForMetric(key: string) {
  switch (key) {
    case "totalUsers":
      return Users;
    case "totalAgencies":
      return Building2;
    case "appSubscriptions":
      return CreditCard;
    case "agencySubscriptions":
      return Ticket;
    case "monthlyRevenue":
      return Wallet;
    case "activeTrips":
      return Activity;
    default:
      return Activity;
  }
}

function iconClass(color: MetricColor) {
  switch (color) {
    case "blue":
      return "bg-blue-600 text-white";
    case "purple":
      return "bg-purple-600 text-white";
    case "green":
      return "bg-green-600 text-white";
    case "teal":
      return "bg-teal-600 text-white";
    case "emerald":
      return "bg-emerald-600 text-white";
    case "orange":
      return "bg-orange-600 text-white";
  }
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div>
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="text-sm text-muted-foreground">Loading dashboard…</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="h-20 animate-pulse rounded-xl bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="text-sm text-red-600">
          {(error as any)?.message || "Failed to load dashboard"}
        </div>
      </div>
    );
  }

  const ui = mapAdminDashboardToUi(data!);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="text-sm text-muted-foreground">
          Welcome back! Here’s what’s happening with your platform.
        </div>
      </div>

      {/* top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ui.metrics.map((m) => {
          const Icon = iconForMetric(m.key);
          return (
            <MetricCard
              key={m.key}
              icon={Icon}
              iconClassName={iconClass(m.color)}
              value={m.value}
              label={m.label}
              changeText={m.change}
              rightTag={m.rightTag}
            />
          );
        })}
      </div>

      {/* chart */}
      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="text-sm font-semibold">{ui.revenue.title}</div>
          <div className="text-xs text-muted-foreground">{ui.revenue.subtitle}</div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="rounded-xl border bg-white p-3">
            <RevenueOverviewChart
              months={ui.revenue.months}
              values={ui.revenue.values}
            />
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground px-1">
            {ui.revenue.months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* revenue summary */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">Total This Month</div>
              <div className="mt-1 text-lg font-semibold">
                {ui.revenue.summary.totalCurrent}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">Agency Revenue</div>
              <div className="mt-1 text-lg font-semibold">
                {ui.revenue.summary.agencyCurrent}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Last month: {ui.revenue.summary.agencyLastMonth}
              </div>
              <div className="mt-1 text-xs font-medium text-green-600">
                {ui.revenue.summary.agencyPercentChange}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">Customer Revenue</div>
              <div className="mt-1 text-lg font-semibold">
                {ui.revenue.summary.customerCurrent}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Last month: {ui.revenue.summary.customerLastMonth}
              </div>
              <div className="mt-1 text-xs font-medium text-green-600">
                {ui.revenue.summary.customerPercentChange}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">Trips Breakdown</div>
              <div className="mt-1 text-lg font-semibold">
                Total: {ui.trips.total}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Agency: {ui.trips.agency}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Customer: {ui.trips.customer}
              </div>
            </div>
          </div>

          {/* currency breakdown */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <div className="text-sm font-semibold">Agency Revenue by Currency</div>
              <div className="mt-3 space-y-2">
                {ui.revenue.summary.agencyCurrencies.map((item) => (
                  <div key={item} className="text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-sm font-semibold">Customer Revenue by Currency</div>
              <div className="mt-3 space-y-2">
                {ui.revenue.summary.customerCurrencies.map((item) => (
                  <div key={item} className="text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}