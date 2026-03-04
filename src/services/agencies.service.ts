// src/services/agencies.service.ts
import { apiGet, apiPatch } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";

export type AgenciesSummaryRes = {
  success: boolean;
  data: {
    totalAgencies: number;
    activeAgencies: number;
    totalTripsCreated: number;
    totalRevenue: number;
  };
};

export type AgenciesListRow = {
  agencyName?: string;
  businessType?: string;
  agencyId: string;
  status?: string;
  subscription?: {
    planKey?: string;
    startDate?: string;
    endDate?: string;
    subStatus?: string;
  };
  totalTrips?: number;
  totalTravelers?: number;
  totalRevenue?: number;
  joinedAt?: string;
};

export type AgenciesListRes = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: AgenciesListRow[];
};

export type AgencyDetailsRes = {
  success: boolean;
  data: any; // keep any for now, you already have sample details response
};

export async function getAgenciesSummary() {
  return apiGet<AgenciesSummaryRes>(ENDPOINTS.AGENCIES.SUMMARY);
}

export async function getAgenciesList(params: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return apiGet<AgenciesListRes>(ENDPOINTS.AGENCIES.LIST, params);
}

export async function getAgencyDetails(agencyId: string) {
  return apiGet<AgencyDetailsRes>(ENDPOINTS.AGENCIES.DETAILS(agencyId));
}

export async function patchAgencySuspend(agencyId: string, suspended: boolean) {
  return apiPatch<{ success: boolean; message: string; data: any }>(
    ENDPOINTS.AGENCIES.SUSPEND(agencyId),
    { suspended },
  );
}