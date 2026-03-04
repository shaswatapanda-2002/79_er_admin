// src/services/dashboard.service.ts
import { apiGet } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";

export type AdminDashboardResponse = {
  success: boolean;
  data: {
    cards: {
      totalAppUsers: number;
      totalAgencies: number;
      totalBuyAppSubscriptions: number;
      totalBuyAgencySubscriptions: number;

      activeTrips: {
        agencyActiveTrips: number;
        customerActiveTrips: number;
        totalActiveTrips: number;
      };

      monthlyRevenue: {
        agency: {
          byCurrency: Record<string, number>;
          primaryCurrency: string; // "usd"
          thisMonth: number;
          lastMonth: number;
          percentChange: number; // number
          unit: "smallest" | "normal";
        };
        customer: {
          byCurrency: Record<string, number>;
          primaryCurrency: string;
          thisMonth: number;
          lastMonth: number;
          percentChange: number;
          unit: "smallest" | "normal";
        };
      };
    };

    revenueOverviewLast7Months: {
      range: { from: string; to: string };
      agencySeries: Array<{ _id: { ym: string }; amount: number }>;
      customerSeries: Array<{ _id: { ym: string }; amount: number }>;
    };
  };
};

export function getAdminDashboard() {
  return apiGet<AdminDashboardResponse>(ENDPOINTS.DASHBOARD.ADMIN);
}