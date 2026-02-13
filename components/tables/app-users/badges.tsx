import { Badge } from "@/components/ui/badge";
import type { Subscription, UserStatus } from "./types";

export function SubscriptionBadge({ value }: { value: Subscription }) {
  const label =
    value === "premium" ? "Premium" :
    value === "pro" ? "Pro" :
    value === "trial" ? "Trial" : "Free";

  const className =
    value === "premium"
      ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
      : value === "pro"
      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
      : value === "trial"
      ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
      : "bg-slate-100 text-slate-700 hover:bg-slate-100";

  return (
    <Badge className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}

export function StatusBadge({ value }: { value: UserStatus }) {
  return value === "active" ? (
    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">
      active
    </Badge>
  ) : (
    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-100">
      suspended
    </Badge>
  );
}
