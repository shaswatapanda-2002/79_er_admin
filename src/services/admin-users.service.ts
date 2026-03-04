// src/services/admin-users.service.ts
import { ENDPOINTS } from "@/src/api/endpoints";
import { apiGet, apiPatch } from "@/lib/http/client";

// ==============================
// Types (keep in this file)
// ==============================
export type ApiListUsersResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Array<{
    totalTrips: number;
    lastTripCreatedAt?: string | null;
    customerId: string;
    name: string;
    email: string;
    userStatus: "active" | "suspended";
    subscription?: {
      plan?: string;
      status?: string | null;
      startDate?: string | null;
      endDate?: string | null;
    };
    joinedAt: string;
  }>;
};

export type ApiUserDetailsResponse = {
  success: boolean;
  data: {
    customerId: string;
    name: string;
    email: string;
    mobile?: string | null;
    isActive: boolean;
    joinedAt: string;
    profilePicture?: string | null;
    subscription?: {
      plan?: string;
      status?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      paymentStatus?: string | null;
    };
    trips?: {
      totalTrips: number;
      recentTrips: Array<{
        _id: string;
        title: string;
        start_date: string;
        end_date: string;
        tripStatus: string;
        createdAt: string;
      }>;
    };
  };
};

export type ApiToggleSuspendResponse = {
  success: boolean;
  message: string;
  data: {
    customerId: string;
    isSuspended: boolean;
    userStatus: "active" | "suspended";
    suspendedAt: string | null;
  };
};

// ==============================
// API Calls
// ==============================
export function listAdminUsers(params: { page?: number; limit?: number } = {}) {
  return apiGet<ApiListUsersResponse>(ENDPOINTS.APP_USERS.LIST, params);
}

export function getAdminUserDetails(customerId: string) {
  return apiGet<ApiUserDetailsResponse>(ENDPOINTS.APP_USERS.DETAILS(customerId));
}

/**
 * ✅ Set suspended explicitly (true/false)
 * backend expects: { suspended: boolean }
 */
export function setAdminUserSuspended(customerId: string, suspended: boolean) {
  return apiPatch<ApiToggleSuspendResponse>(
    ENDPOINTS.APP_USERS.TOGGLE_SUSPEND(customerId),
    { suspended },
  );
}