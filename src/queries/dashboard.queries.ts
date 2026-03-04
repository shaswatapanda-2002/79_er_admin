// src/queries/dashboard.queries.ts
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/src/services/dashboard.service";

export const dashboardKeys = {
  admin: () => ["dashboard", "admin"] as const,
};

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: getAdminDashboard,
    staleTime: 30_000,
    retry: 1,
  });
}