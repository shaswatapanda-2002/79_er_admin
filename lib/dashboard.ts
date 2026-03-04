// lib/dashboard.ts
import type { AdminDashboardResponse } from "@/src/services/dashboard.service";

export type MetricColor = "blue" | "purple" | "green" | "teal" | "emerald" | "orange";

export type DashboardMetric = {
  key:
    | "totalUsers"
    | "totalAgencies"
    | "appSubscriptions"
    | "agencySubscriptions"
    | "monthlyRevenue"
    | "activeTrips";
  value: string;
  label: string;
  change?: string;
  rightTag?: string;
  color: MetricColor;
};

export type DashboardActivity = {
  title: string;
  by: string;
  note: string;
  time: string;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  revenue: {
    title: string;
    subtitle: string;
    months: string[];
    values: number[];
  };
  activity: DashboardActivity[];
};

function monthKey(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // "2026-02"
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, 1));
  return dt.toLocaleString("en-US", { month: "short" }); // "Feb"
}

function buildRangeMonths(fromISO: string, toISO: string) {
  // backend gives range.from and range.to (to is next month boundary)
  const from = new Date(fromISO);
  const to = new Date(toISO);

  const months: string[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));

  // add months until cursor < to
  while (cursor < to) {
    months.push(monthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return months; // ["2025-09", ...]
}

function toSeriesMap(rows: Array<{ _id: { ym: string }; amount: number }>) {
  const m = new Map<string, number>();
  for (const r of rows || []) m.set(r._id.ym, Number(r.amount || 0));
  return m;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatMoney(amount: number, currency: string, unit: "smallest" | "normal") {
  const cur = (currency || "usd").toUpperCase();
  const normal = unit === "smallest" ? amount / 100 : amount;

  // keep it compact but readable
  if (normal >= 1_000_000) return `${cur} ${(normal / 1_000_000).toFixed(1)}M`;
  if (normal >= 1_000) return `${cur} ${(normal / 1_000).toFixed(1)}K`;
  return `${cur} ${normal.toFixed(2)}`;
}

export function mapAdminDashboardToUi(api: AdminDashboardResponse): DashboardData {
  const cards = api?.data?.cards;

  const totalUsers = cards?.totalAppUsers ?? 0;
  const totalAgencies = cards?.totalAgencies ?? 0;
  const appSubs = cards?.totalBuyAppSubscriptions ?? 0;
  const agencySubs = cards?.totalBuyAgencySubscriptions ?? 0;

  const activeTripsTotal = cards?.activeTrips?.totalActiveTrips ?? 0;

  const agencyRev = cards?.monthlyRevenue?.agency;
  const customerRev = cards?.monthlyRevenue?.customer;

  const agencyThis = agencyRev?.thisMonth ?? 0;
  const customerThis = customerRev?.thisMonth ?? 0;

  // Use primary currency from agency (fallback customer)
  const primaryCurrency = agencyRev?.primaryCurrency || customerRev?.primaryCurrency || "usd";

  // For display: show combined monthly revenue (convert smallest->normal for agency if needed)
  const agencyThisNormal = (agencyRev?.unit === "smallest") ? agencyThis / 100 : agencyThis;
  const customerThisNormal = (customerRev?.unit === "smallest") ? customerThis / 100 : customerThis;
  const combinedThisNormal = agencyThisNormal + customerThisNormal;

  // percent change: prefer agency percent if exists, else customer
  const pct =
    typeof agencyRev?.percentChange === "number"
      ? agencyRev.percentChange
      : typeof customerRev?.percentChange === "number"
      ? customerRev.percentChange
      : 0;

  const changeText = pct === 0 ? undefined : `${pct > 0 ? "↗" : "↘"} ${Math.abs(pct).toFixed(1)}%`;

  // Revenue chart
  const ro = api?.data?.revenueOverviewLast7Months;
  const ymList = ro?.range ? buildRangeMonths(ro.range.from, ro.range.to) : [];

  const agencyMap = toSeriesMap(ro?.agencySeries || []);
  const customerMap = toSeriesMap(ro?.customerSeries || []);

  const months = ymList.map(monthLabel);
  const values = ymList.map((ym) => (agencyMap.get(ym) || 0) + (customerMap.get(ym) || 0));

  return {
    metrics: [
      { key: "totalUsers", value: formatNumber(totalUsers), label: "Total App Users", color: "blue" },
      { key: "totalAgencies", value: formatNumber(totalAgencies), label: "Total Agencies", color: "purple" },
      { key: "appSubscriptions", value: formatNumber(appSubs), label: "App Subscriptions", color: "green" },
      { key: "agencySubscriptions", value: formatNumber(agencySubs), label: "Agency Subscriptions", color: "teal" },
      {
        key: "monthlyRevenue",
        value: `${primaryCurrency.toUpperCase()} ${combinedThisNormal.toFixed(2)}`,
        label: "Monthly Revenue",
        change: changeText,
        color: "emerald",
      },
      { key: "activeTrips", value: formatNumber(activeTripsTotal), label: "Active Trips", rightTag: "Live", color: "orange" },
    ],

    revenue: {
      title: "Revenue Overview",
      subtitle: "Last 7 months performance",
      months,
      values,
    },

    // Your API response doesn’t include recent activity yet.
    // Keep empty so UI renders nicely (or keep your existing dummy list if you want).
    activity: [],
  };
}