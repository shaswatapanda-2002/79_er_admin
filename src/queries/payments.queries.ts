// src/queries/payments.queries.ts
import { useQuery } from "@tanstack/react-query";
import { getPaymentsList, getPaymentsSummary } from "@/src/services/payments.service";

export const paymentsKeys = {
  all: ["payments"] as const,
  summary: () => [...paymentsKeys.all, "summary"] as const,
  list: (params: any) => [...paymentsKeys.all, "list", params] as const,
};

export function usePaymentsSummaryQuery() {
  return useQuery({
    queryKey: paymentsKeys.summary(),
    queryFn: getPaymentsSummary,
  });
}

export function usePaymentsListQuery(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: paymentsKeys.list(params),
    queryFn: () => getPaymentsList(params),
  });
}