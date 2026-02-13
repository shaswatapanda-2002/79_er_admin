export type PlanType = "app" | "agency";
export type BillingCycle = "month" | "year";

export type Plan = {
  id: string;
  type: PlanType;

  name: string;
  subtitle: string;

  price: number; // numeric
  cycle: BillingCycle;

  description: string; // short paragraph
  features: string; // textarea style (one paragraph)

  cta: string;
  popular?: boolean;
};

export const APP_PLANS: Plan[] = [
  {
    id: "app-free",
    type: "app",
    name: "Free",
    subtitle: "Best for individual travelers",
    price: 0,
    cycle: "month",
    description: "Enjoy essential features to plan your personal trips effortlessly.",
    features: "Unlock basic itinerary, saved places, and limited collaboration.",
    cta: "Choose Free",
  },
  {
    id: "app-plus",
    type: "app",
    name: "Plus",
    subtitle: "For frequent travelers",
    price: 2.99,
    cycle: "month",
    description: "Unlock advanced planning tools like expense tracking and collaborative editing.",
    features: "Expense tracking, collaboration, priority support, and smart suggestions.",
    cta: "Choose Plus",
    popular: true,
  },
  {
    id: "app-premium",
    type: "app",
    name: "Premium",
    subtitle: "For travel power users",
    price: 9.99,
    cycle: "month",
    description: "Access full features including AI itinerary with maps, weather-based planning, and unlimited trips.",
    features: "AI itinerary, maps, weather insights, unlimited trips, premium support.",
    cta: "Choose Premium",
  },
];

export const AGENCY_PLANS: Plan[] = [
  {
    id: "b2b-basic",
    type: "agency",
    name: "Basic",
    subtitle: "Perfect for solo operators",
    price: 29,
    cycle: "month",
    description: "Ideal for individual guides starting their journey with essential trip management tools.",
    features: "Basic dashboard, limited users, core trip tools.",
    cta: "Start Basic Plan",
  },
  {
    id: "b2b-starter",
    type: "agency",
    name: "Starter",
    subtitle: "Built for small teams",
    price: 99,
    cycle: "month",
    description: "Perfect for small travel agencies managing multiple trips with enhanced capacity and features.",
    features: "Team access, more trips, basic integrations.",
    cta: "Choose Starter",
  },
  {
    id: "b2b-pro",
    type: "agency",
    name: "Pro",
    subtitle: "Built for growing agencies",
    price: 499,
    cycle: "month",
    description: "Advanced features including AI tools and detailed reporting for professional travel operations.",
    features: "AI tools, advanced reporting, priority support, integrations.",
    cta: "Choose Pro",
    popular: true,
  },
  {
    id: "b2b-enterprise",
    type: "agency",
    name: "Enterprise",
    subtitle: "For large organizations",
    price: 999,
    cycle: "month",
    description: "Complete solution with unlimited trips, white-labeling, and custom integrations for enterprise needs.",
    features: "Unlimited, white-label, custom integrations, dedicated success manager.",
    cta: "Contact for Enterprise",
  },
];
