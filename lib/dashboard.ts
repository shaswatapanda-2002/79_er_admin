// lib/dashboard.ts
import type { AdminDashboardResponse } from "@/src/services/dashboard.service";

export type MetricColor =
  | "blue"
  | "purple"
  | "green"
  | "teal"
  | "emerald"
  | "orange";

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

export type DashboardRevenueSummary = {
  totalCurrent: string;
  agencyCurrent: string;
  customerCurrent: string;
  agencyLastMonth: string;
  customerLastMonth: string;
  agencyPercentChange: string;
  customerPercentChange: string;
  agencyCurrencies: string[];
  customerCurrencies: string[];
};

export type DashboardTripsSummary = {
  total: string;
  agency: string;
  customer: string;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  revenue: {
    title: string;
    subtitle: string;
    months: string[];
    values: number[];
    summary: DashboardRevenueSummary;
  };
  trips: DashboardTripsSummary;
};

function monthKey(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, 1));
  return dt.toLocaleString("en-US", { month: "short" });
}

function buildRangeMonths(fromISO: string, toISO: string) {
  const from = new Date(fromISO);
  const to = new Date(toISO);

  const months: string[] = [];
  const cursor = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1)
  );

  while (cursor < to) {
    months.push(monthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
}

function toSeriesMap(rows: Array<{ _id: { ym: string }; amount: number }>) {
  const m = new Map<string, number>();
  for (const r of rows || []) {
    m.set(r._id.ym, Number(r.amount || 0));
  }
  return m;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatPercent(n: number) {
  const sign = n > 0 ? "↗" : n < 0 ? "↘" : "→";
  return `${sign} ${Math.abs(n).toFixed(1)}%`;
}

function normalizeMoney(amount: number, unit: "smallest" | "normal") {
  return unit === "smallest" ? amount / 100 : amount;
}

function formatMoney(
  amount: number,
  currency: string,
  unit: "smallest" | "normal"
) {
  const normal = normalizeMoney(amount, unit);
  const cur = (currency || "usd").toUpperCase();
  return `${cur} ${normal.toFixed(2)}`;
}

function formatCurrencies(obj?: Record<string, number>) {
  const entries = Object.entries(obj || {});
  if (!entries.length) return ["—"];

  return entries.map(([currency, amount]) => {
    return `${currency.toUpperCase()}: ${amount}`;
  });
}

export function mapAdminDashboardToUi(
  api: AdminDashboardResponse
): DashboardData {
  const cards = api?.data?.cards;

  const totalUsers = cards?.totalAppUsers ?? 0;
  const totalAgencies = cards?.totalAgencies ?? 0;
  const appSubs = cards?.totalBuyAppSubscriptions ?? 0;
  const agencySubs = cards?.totalBuyAgencySubscriptions ?? 0;

  const agencyTrips = cards?.activeTrips?.agencyActiveTrips ?? 0;
  const customerTrips = cards?.activeTrips?.customerActiveTrips ?? 0;
  const activeTripsTotal = cards?.activeTrips?.totalActiveTrips ?? 0;

  const agencyRev = cards?.monthlyRevenue?.agency;
  const customerRev = cards?.monthlyRevenue?.customer;

  const agencyCurrency = agencyRev?.primaryCurrency || "usd";
  const customerCurrency = customerRev?.primaryCurrency || "usd";

  const agencyThis = agencyRev?.thisMonth ?? 0;
  const agencyLast = agencyRev?.lastMonth ?? 0;
  const agencyPct = agencyRev?.percentChange ?? 0;
  const agencyUnit = agencyRev?.unit ?? "normal";

  const customerThis = customerRev?.thisMonth ?? 0;
  const customerLast = customerRev?.lastMonth ?? 0;
  const customerPct = customerRev?.percentChange ?? 0;
  const customerUnit = customerRev?.unit ?? "normal";

  const agencyThisNormal = normalizeMoney(agencyThis, agencyUnit);
  const customerThisNormal = normalizeMoney(customerThis, customerUnit);
  const combinedThisNormal = agencyThisNormal + customerThisNormal;

  const primaryCurrency =
    agencyRev?.primaryCurrency || customerRev?.primaryCurrency || "usd";

  const ro = api?.data?.revenueOverviewLast7Months;
  const ymList = ro?.range ? buildRangeMonths(ro.range.from, ro.range.to) : [];

  const agencyMap = toSeriesMap(ro?.agencySeries || []);
  const customerMap = toSeriesMap(ro?.customerSeries || []);

  const months = ymList.map(monthLabel);
  const values = ymList.map((ym) => {
    const agencyAmount = agencyMap.get(ym) || 0;
    const customerAmount = customerMap.get(ym) || 0;
    return agencyAmount + customerAmount;
  });

  return {
    metrics: [
      {
        key: "totalUsers",
        value: formatNumber(totalUsers),
        label: "Total App Users",
        color: "blue",
      },
      {
        key: "totalAgencies",
        value: formatNumber(totalAgencies),
        label: "Total Agencies",
        color: "purple",
      },
      {
        key: "appSubscriptions",
        value: formatNumber(appSubs),
        label: "App Subscriptions",
        color: "green",
      },
      {
        key: "agencySubscriptions",
        value: formatNumber(agencySubs),
        label: "Agency Subscriptions",
        color: "teal",
      },
      {
        key: "monthlyRevenue",
        value: `${primaryCurrency.toUpperCase()} ${combinedThisNormal.toFixed(2)}`,
        label: "Monthly Revenue",
        change: formatPercent(agencyPct),
        rightTag: `Agency ${formatMoney(
          agencyThis,
          agencyCurrency,
          agencyUnit
        )} • Customer ${formatMoney(
          customerThis,
          customerCurrency,
          customerUnit
        )}`,
        color: "emerald",
      },
      {
        key: "activeTrips",
        value: formatNumber(activeTripsTotal),
        label: "Active Trips",
        rightTag: `Agency ${agencyTrips} • Customer ${customerTrips}`,
        color: "orange",
      },
    ],

    revenue: {
      title: "Revenue Overview",
      subtitle: "Last 7 months performance",
      months,
      values,
      summary: {
        totalCurrent: `${primaryCurrency.toUpperCase()} ${combinedThisNormal.toFixed(2)}`,
        agencyCurrent: formatMoney(agencyThis, agencyCurrency, agencyUnit),
        customerCurrent: formatMoney(customerThis, customerCurrency, customerUnit),
        agencyLastMonth: formatMoney(agencyLast, agencyCurrency, agencyUnit),
        customerLastMonth: formatMoney(customerLast, customerCurrency, customerUnit),
        agencyPercentChange: formatPercent(agencyPct),
        customerPercentChange: formatPercent(customerPct),
        agencyCurrencies: formatCurrencies(agencyRev?.byCurrency),
        customerCurrencies: formatCurrencies(customerRev?.byCurrency),
      },
    },

    trips: {
      total: formatNumber(activeTripsTotal),
      agency: formatNumber(agencyTrips),
      customer: formatNumber(customerTrips),
    },
  };
}