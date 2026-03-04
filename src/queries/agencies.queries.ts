// src/queries/agencies.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAgenciesList,
  getAgenciesSummary,
  getAgencyDetails,
  patchAgencySuspend,
} from "@/src/services/agencies.service";

export const agenciesKeys = {
  all: ["agencies"] as const,
  summary: () => [...agenciesKeys.all, "summary"] as const,
  list: (params: any) => [...agenciesKeys.all, "list", params] as const,
  details: (agencyId: string) => [...agenciesKeys.all, "details", agencyId] as const,
};

export function useAgenciesSummaryQuery() {
  return useQuery({
    queryKey: agenciesKeys.summary(),
    queryFn: getAgenciesSummary,
  });
}

export function useAgenciesListQuery(params: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: agenciesKeys.list(params),
    queryFn: () => getAgenciesList(params),
  });
}

export function useAgencyDetailsQuery(agencyId?: string | null, enabled = true) {
  return useQuery({
    queryKey: agencyId ? agenciesKeys.details(agencyId) : ["agencies", "details", "none"],
    queryFn: () => getAgencyDetails(agencyId as string),
    enabled: Boolean(agencyId) && enabled,
  });
}

export function useToggleAgencySuspendMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ agencyId, suspended }: { agencyId: string; suspended: boolean }) =>
      patchAgencySuspend(agencyId, suspended),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agenciesKeys.summary() });
      qc.invalidateQueries({ queryKey: agenciesKeys.all });
    },
  });
}