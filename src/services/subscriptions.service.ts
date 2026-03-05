import { apiGet, apiPatch } from "@/lib/http/client";
import type { AgencyPlanApi, CustomerPlanApi } from "@/lib/subscription-plans";

export type ApiListResponse<T> = {
  success: boolean;
  total?: number;
  data: T[];
};

export async function getAgencyPlans() {
  return apiGet<ApiListResponse<AgencyPlanApi>>("/api/admin/get-agency-plans");
}

export async function getCustomerPlans() {
  return apiGet<ApiListResponse<CustomerPlanApi>>("/api/admin/get-user-plans");
}

export async function updateAgencyPlan(planId: string, patch: any) {
  return apiPatch(`/api/admin/agency-plans/${planId}`, patch);
}

export async function updateCustomerPlan(planId: string, patch: any) {
  return apiPatch(`/api/admin/customer-plans/${planId}`, patch);
}