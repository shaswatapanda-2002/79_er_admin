import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAgencyPlans,
  getCustomerPlans,
  updateAgencyPlan,
  updateCustomerPlan,
} from "@/src/services/subscriptions.service";

export const subscriptionsKeys = {
  root: ["subscriptions"] as const,
  agency: () => [...subscriptionsKeys.root, "agency"] as const,
  customer: () => [...subscriptionsKeys.root, "customer"] as const,
};

export function useAgencyPlansQuery() {
  return useQuery({
    queryKey: subscriptionsKeys.agency(),
    queryFn: getAgencyPlans,
    staleTime: 30_000,
  });
}

export function useCustomerPlansQuery() {
  return useQuery({
    queryKey: subscriptionsKeys.customer(),
    queryFn: getCustomerPlans,
    staleTime: 30_000,
  });
}

export function useUpdateAgencyPlanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => updateAgencyPlan(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionsKeys.agency() });
    },
  });
}

export function useUpdateCustomerPlanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => updateCustomerPlan(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionsKeys.customer() });
    },
  });
}