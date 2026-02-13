import { Badge } from "@/components/ui/badge";
import type { DemoStatus } from "./types";

export function StatusBadge({ status }: { status: DemoStatus }) {
  if (status === "new") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
        new
      </Badge>
    );
  }
  if (status === "contacted") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
        contacted
      </Badge>
    );
  }
  if (status === "scheduled") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-100">
        scheduled
      </Badge>
    );
  }
  if (status === "completed") {
    return (
      <Badge className="rounded-full px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-100">
        completed
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-100">
      rejected
    </Badge>
  );
}
