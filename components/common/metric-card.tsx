import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  icon: Icon,
  iconClassName,
  value,
  label,
  changeText,
  rightTag,
}: {
  icon: LucideIcon;
  iconClassName: string;
  value: string;
  label: string;
  changeText?: string;
  rightTag?: string;
}) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${iconClassName}`}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex items-center gap-2">
            {changeText ? <span className="text-xs font-medium text-green-600">{changeText}</span> : null}
            {rightTag ? <span className="text-[11px] text-muted-foreground">{rightTag}</span> : null}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-semibold leading-7">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
