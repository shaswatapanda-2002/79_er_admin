import { getDashboardData, type MetricColor } from "@/lib/dashboard";
import { MetricCard } from "@/components/common/metric-card";
import { RecentActivity } from "@/components/common/recent-activity";
import RevenueOverviewChart from "@/components/common/revenue-overview-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Building2, CreditCard, Ticket, Wallet, Activity } from "lucide-react";

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

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-5">
      <div>
        <div className="text-2xl font-semibold">Dashboard</div>
        <div className="text-sm text-muted-foreground">
          Welcome back! Here’s what’s happening with your platform.
        </div>
      </div>

      {/* Cards (3 + 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.metrics.map((m) => {
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

      {/* Revenue + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl border bg-white shadow-sm xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="text-sm font-semibold">{data.revenue.title}</div>
            <div className="text-xs text-muted-foreground">{data.revenue.subtitle}</div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="rounded-xl border bg-white p-3">
              <RevenueOverviewChart months={data.revenue.months} values={data.revenue.values} />
            </div>

            <div className="mt-3 flex justify-between text-[11px] text-muted-foreground px-1">
              {data.revenue.months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <RecentActivity items={data.activity} />
      </div>
    </div>
  );
}
