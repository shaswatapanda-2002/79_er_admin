// src/queries/admin-users.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUserDetails,
  listAdminUsers,
  setAdminUserSuspended,
  type ApiListUsersResponse,
  type ApiUserDetailsResponse,
  type ApiToggleSuspendResponse,
} from "@/src/services/admin-users.service";

export const adminUsersKeys = {
  root: ["adminUsers"] as const,

  list: (params: { page: number; limit: number }) =>
    [...adminUsersKeys.root, "list", params.page, params.limit] as const,

  details: (customerId: string) =>
    [...adminUsersKeys.root, "details", customerId] as const,
};

export function useAdminUsersQuery(params: { page: number; limit: number }) {
  return useQuery<ApiListUsersResponse>({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => listAdminUsers(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    // react-query v5: keep old list while paging
    placeholderData: (prev) => prev,
  });
}

export function useAdminUserDetailsQuery(opts: {
  customerId: string | null;
  enabled?: boolean;
}) {
  const customerId = opts.customerId || "";
  const enabled = !!opts.customerId && (opts.enabled ?? true);

  return useQuery<ApiUserDetailsResponse>({
    queryKey: adminUsersKeys.details(customerId),
    queryFn: () => getAdminUserDetails(customerId),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/**
 * ✅ Explicitly suspend/unsuspend using boolean:
 * mutation.mutate({ customerId, suspended: true/false })
 */
export function useSetAdminUserSuspendedMutation() {
  const qc = useQueryClient();

  return useMutation<
    ApiToggleSuspendResponse,
    unknown,
    { customerId: string; suspended: boolean }
  >({
    mutationFn: ({ customerId, suspended }) =>
      setAdminUserSuspended(customerId, suspended),

    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminUsersKeys.root });
      qc.invalidateQueries({ queryKey: adminUsersKeys.details(vars.customerId) });
    },
  });
}