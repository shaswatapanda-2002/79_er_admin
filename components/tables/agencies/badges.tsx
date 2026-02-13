// src/components/tables/agencies/badges.tsx
import { Badge } from "@/components/ui/badge";
import type { AgencyStatus, SubscriptionPlan, VerificationStatus } from "./types";

export function VerificationBadge({ value }: { value: VerificationStatus }) {
  if (value === "approved") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">
        approved
      </Badge>
    );
  }

  if (value === "pending") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
        pending
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-100">
      rejected
    </Badge>
  );
}

export function SubscriptionBadge({ value }: { value: SubscriptionPlan }) {
  const label =
    value === "enterprise"
      ? "Enterprise"
      : value === "pro"
      ? "Pro"
      : value === "starter"
      ? "Starter"
      : "Basic";

  const className =
    value === "enterprise"
      ? "bg-slate-100 text-slate-800 hover:bg-slate-100"
      : value === "pro"
      ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
      : value === "starter"
      ? "bg-green-100 text-green-700 hover:bg-green-100"
      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";

  return (
    <Badge className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}

export function StatusBadge({ value }: { value: AgencyStatus }) {
  if (value === "active") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">
        active
      </Badge>
    );
  }

  if (value === "suspended") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-100">
        suspended
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-100">
      blocked
    </Badge>
  );
}
