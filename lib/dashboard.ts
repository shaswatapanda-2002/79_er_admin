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

export async function getDashboardData(): Promise<DashboardData> {
  return {
    metrics: [
      { key: "totalUsers", value: "12,847", label: "Total App Users", change: "↗ 12.5%", color: "blue" },
      { key: "totalAgencies", value: "243", label: "Total Agencies", change: "↗ 8.3%", color: "purple" },
      { key: "appSubscriptions", value: "3", label: "App Subscriptions", color: "green" },
      { key: "agencySubscriptions", value: "3", label: "Agency Subscriptions", color: "teal" },
      { key: "monthlyRevenue", value: "$284.8K", label: "Monthly Revenue", change: "↗ 15.7%", color: "emerald" },
      { key: "activeTrips", value: "1523", label: "Active Trips", rightTag: "Live", color: "orange" },
    ],
    revenue: {
      title: "Revenue Overview",
      subtitle: "Last 7 months performance",
      months: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
      values: [160000, 175000, 195000, 220000, 245000, 260000, 270000],
    },
    activity: [
      { title: "User suspended", by: "John Admin", note: "Suspended due to terms violation.", time: "09/02/2026, 10:30:00" },
      { title: "Agency verified", by: "Super Admin", note: "Verified agency documents.", time: "08/02/2026, 09:15:00" },
      { title: "Ticket assigned", by: "Mike", note: "Support ticket assigned to agent.", time: "08/02/2026, 14:20:00" },
      { title: "Subscription upgraded", by: "Sarah Finance", note: "Upgraded from Pro to Enterprise.", time: "07/02/2026, 11:45:00" },
    ],
  };
}
