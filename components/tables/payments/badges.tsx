import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, PaymentType } from "./types";

export function StatusBadge({ status }: { status: PaymentStatus }) {
  if (status === "completed") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-100">
        completed
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
        pending
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-100">
      refunded
    </Badge>
  );
}

export function TypePill({ type }: { type: PaymentType }) {
  return (
    <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
      {type}
    </span>
  );
}
