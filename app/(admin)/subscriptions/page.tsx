import SubscriptionPlansClient from "@/components/subscriptions/subscription-plans-client";
import { APP_PLANS, AGENCY_PLANS } from "@/lib/subscription-plans";

export default function SubscriptionsPage() {
  return <SubscriptionPlansClient appPlans={APP_PLANS} agencyPlans={AGENCY_PLANS} />;
}
