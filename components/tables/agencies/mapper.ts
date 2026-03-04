// components/tables/agencies/mapper.ts
import type { Agency, AgencyStatus, SubscriptionPlan, VerificationStatus } from "./types";

function toAgencyStatus(status?: string): AgencyStatus {
  const s = (status || "").toLowerCase();
  if (s === "blocked") return "blocked";
  if (s === "suspended") return "suspended";
  return "active";
}

function toPlan(planKey?: string): SubscriptionPlan {
  const p = (planKey || "").toLowerCase();
  if (p === "enterprise") return "enterprise";
  if (p === "pro") return "pro";
  if (p === "starter") return "starter";
  return "basic";
}

export function mapAgencyRowToUI(row: any): Agency {
  const id = row.agencyId || row._id || row.id;

  const joined = row.joinedAt
    ? new Date(row.joinedAt).toLocaleDateString()
    : "-";

  // backend list doesn't provide verification yet
  const verification: VerificationStatus = "approved";

  return {
    id: String(id),
    name: row.agencyName || "-",
    type: row.businessType || "-",

    // not present in list response
    adminName: "-",
    email: "-",
    phone: "-",
    registrationNumber: "-",

    verification,
    subscription: toPlan(row.subscription?.planKey),
    status: toAgencyStatus(row.status),

    totalTrips: Number(row.totalTrips ?? 0),
    activeTravelers: Number(row.totalTravelers ?? 0), // using totalTravelers for now
    staffCount: 0,

    joined,
    revenueContribution: Number(row.totalRevenue ?? 0),
  };
}