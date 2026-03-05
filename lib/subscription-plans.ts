export type PlanType = "app" | "agency";
export type BillingCycle = "month" | "year";

export type Plan = {
  id: string; // backend _id
  type: PlanType;

  name: string; // displayName
  subtitle: string;

  price: number;
  cycle: BillingCycle;
  currency?: string;

  description: string;
  features: string; // textarea style (one paragraph)

  cta: string;
  popular?: boolean;

  // extra backend fields (used for edit)
  status?: "active" | "inactive";
  stripePriceId?: string | null;

  // keep full backend feature object too (optional)
  featuresObj?: Record<string, any>;
};

/* =========================
   Backend API types
========================= */

export type AgencyPlanApi = {
  _id: string;
  key: string;
  displayName: string;
  slug?: string;
  description?: string;
  priceDisplay: { monthly: number; currency: string };
  limits?: { activeTripsLimit?: number };
  features?: Record<string, boolean>;
  includesTrial?: boolean;
  trialDays?: number;
  isPopular?: boolean;
  status?: "active" | "inactive";
  stripePriceId?: string | null;
};

export type CustomerPlanApi = {
  _id: string;
  plan: string; // free | plus_monthly | plus_yearly | ...
  displayName: string;
  description?: string;
  price: number;
  currency: string;
  features?: Record<string, boolean>;
  isPopular?: boolean;
  status?: "active" | "inactive";
  stripePriceId?: string | null;
  appleProductId?: string | null;
  maxActiveTrips?: number | null;
  maxInvitesPerTrip?: number | null;
};

/* =========================
   Helpers
========================= */

function titleizeFeatureKey(k: string) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function featuresToText(features?: Record<string, boolean>) {
  if (!features) return "";
  const enabled = Object.entries(features)
    .filter(([, v]) => !!v)
    .map(([k]) => titleizeFeatureKey(k));
  return enabled.join(", ");
}

function detectCycleFromCustomerPlan(planKey: string): BillingCycle {
  if (planKey.endsWith("_yearly")) return "year";
  return "month"; // free + *_monthly
}

function subtitleFromCustomerKey(key: string) {
  if (key === "free") return "Best for individual travelers";
  if (key.startsWith("plus")) return "For frequent travelers";
  if (key.startsWith("premium")) return "For travel power users";
  if (key.startsWith("enterprise")) return "For high usage teams";
  return "";
}

/* =========================
   Mappers: API -> UI Plan
========================= */

export function mapAgencyPlanToUI(p: AgencyPlanApi): Plan {
  return {
    id: p._id,
    type: "agency",

    name: p.displayName,
    subtitle: "Agency Plan",

    price: p.priceDisplay?.monthly ?? 0,
    cycle: "month",
    currency: p.priceDisplay?.currency ?? "SGD",

    description: p.description || "",
    features: featuresToText(p.features),

    cta: "Choose Plan",
    popular: !!p.isPopular,

    status: p.status ?? "active",
    stripePriceId: p.stripePriceId ?? null,

    featuresObj: p.features ?? {},
  };
}

export function mapCustomerPlanToUI(p: CustomerPlanApi): Plan {
  const cycle = detectCycleFromCustomerPlan(p.plan);

  return {
    id: p._id,
    type: "app",

    name: p.displayName,
    subtitle: subtitleFromCustomerKey(p.plan),

    price: p.price ?? 0,
    cycle,
    currency: p.currency ?? "USD",

    description: p.description || "",
    features: featuresToText(p.features),

    cta: "Choose Plan",
    popular: !!p.isPopular,

    status: p.status ?? "active",
    stripePriceId: p.stripePriceId ?? null,

    featuresObj: p.features ?? {},
  };
}