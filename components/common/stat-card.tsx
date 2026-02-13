import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon,
  meta,
  className,
}: {
  title: string;
  value: string;
  meta?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-2xl", className)}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {meta ? <div className="text-xs text-muted-foreground mt-1">{meta}</div> : null}
        </div>
        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-orange-600" />
        </div>
      </CardContent>
    </Card>
  );
}
