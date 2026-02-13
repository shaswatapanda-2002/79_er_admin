// src/components/tables/agencies/types.ts
export type VerificationStatus = "approved" | "pending" | "rejected";
export type AgencyStatus = "active" | "suspended" | "blocked";
export type SubscriptionPlan = "pro" | "enterprise" | "starter" | "basic";

export type Agency = {
  id: string;
  name: string;
  type: string;

  adminName: string;
  email: string;
  phone: string;

  registrationNumber: string;

  verification: VerificationStatus;
  subscription: SubscriptionPlan;
  status: AgencyStatus;

  totalTrips: number;
  activeTravelers: number;
  staffCount: number;

  joined: string;
  revenueContribution: number;
};
