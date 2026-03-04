// src/queries/analytics.queries.ts
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverview } from "@/src/services/analytics.service";

export const analyticsKeys = {
  all: ["analytics"] as const,
  overview: () => [...analyticsKeys.all, "overview"] as const,
};

export function useAnalyticsOverviewQuery() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: getAnalyticsOverview,
    staleTime: 30_000,
  });
}