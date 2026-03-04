// src/services/payments.service.ts
import { apiGet } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";

export type PaymentsSummaryRes = {
  success: boolean;
  data: {
    totalRevenue: number;
    totalTransactions: number;
  };
};

export type PaymentEntity = {
  kind: "agency" | "user" | string;
  id: string;
};

export type PaymentsListRow = {
  sourceId: string;
  type: "agency" | "user" | string; // backend calls it type
  invoiceNumber?: string;
  plan?: string;
  amount: number;
  currency?: string;
  purchasedAt: string;
  entity: PaymentEntity;
};

export type PaymentsListRes = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: PaymentsListRow[];
};

export async function getPaymentsSummary() {
  return apiGet<PaymentsSummaryRes>(ENDPOINTS.PAYMENTS.SUMMARY);
}

export async function getPaymentsList(params: { page?: number; limit?: number }) {
  return apiGet<PaymentsListRes>(ENDPOINTS.PAYMENTS.LIST, params);
}

// export endpoint returns CSV text
export async function getPaymentsExportCsv(params?: { page?: number; limit?: number }) {
  // if your backend supports params, keep it. if not, it will ignore.
  return apiGet<string>(ENDPOINTS.PAYMENTS.EXPORT, params);
}