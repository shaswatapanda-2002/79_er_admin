// src/services/analytics.service.ts
import { apiGet } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";

export type AnalyticsOverviewRes = {
  success: boolean;
  data: {
    cards: {
      totalUsers: { value: number; growthPct: number };
      activeAgencies: { value: number; growthPct: number };
      monthlyRevenue: { value: number; growthPct: number };
      conversionRate: { value: number; growthPct: number };
    };
    charts: {
      userGrowthTrend: Array<{
        month: string; // "YYYY-MM"
        totalUsers: number;
        activeUsers: number;
      }>;
      revenueBreakdown: Array<{
        month: string;
        customerRevenue: number;
        agencyRevenue: number;
      }>;
      subscriptionDistribution: Array<{
        plan: string;
        count: number;
      }>;
      agencyPerformanceByPlan: Array<{
        planKey: string;
        agencyCount: number;
        revenue: number;
      }>;
    };
    meta?: any;
  };
};

export async function getAnalyticsOverview() {
  return apiGet<AnalyticsOverviewRes>(ENDPOINTS.ANALYTICS.OVERVIEW);
}