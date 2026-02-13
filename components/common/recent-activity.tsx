import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DashboardActivity } from "@/lib/dashboard";

export function RecentActivity({ items }: { items: DashboardActivity[] }) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="text-sm font-semibold">Recent Activity</div>
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        {items.map((a, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-1 h-6 w-6 rounded-full border flex items-center justify-center text-[11px] text-muted-foreground">
              ⓘ
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium leading-5">{a.title}</div>
              <div className="text-xs text-muted-foreground">by {a.by}</div>
              <div className="text-xs text-muted-foreground">{a.note}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{a.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
