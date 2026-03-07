"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import type { BillingCycle, Plan, PlanType } from "@/lib/subscription-plans";
import { mapAgencyPlanToUI, mapCustomerPlanToUI } from "@/lib/subscription-plans";

import { PlanCard } from "./plan-card";
import { EditPlansDialog } from "./edit-plans-dialog";

import {
  useAgencyPlansQuery,
  useCustomerPlansQuery,
  useUpdateAgencyPlanMutation,
  useUpdateCustomerPlanMutation,
} from "@/src/queries/subscriptions.queries";

export default function SubscriptionPlansClient() {
  const [tab, setTab] = useState<PlanType>("app");
  const [open, setOpen] = useState(false);

  const [editingPlanId, setEditingPlanId] = useState<string>("");
  const [editingPlanType, setEditingPlanType] = useState<PlanType>("app");

  const [appCycle, setAppCycle] = useState<BillingCycle>("month");

  const agencyQ = useAgencyPlansQuery();
  const customerQ = useCustomerPlansQuery();

  const updateAgency = useUpdateAgencyPlanMutation();
  const updateCustomer = useUpdateCustomerPlanMutation();

  const loading = agencyQ.isLoading || customerQ.isLoading;

  const plans: Plan[] = useMemo(() => {
    const agency = (agencyQ.data?.data ?? []).map(mapAgencyPlanToUI);
    const customer = (customerQ.data?.data ?? []).map(mapCustomerPlanToUI);
    return [...customer, ...agency];
  }, [agencyQ.data, customerQ.data]);

  const appAll = useMemo(() => plans.filter((p) => p.type === "app"), [plans]);
  const agencyAll = useMemo(() => plans.filter((p) => p.type === "agency"), [plans]);

  const app = useMemo(() => appAll.filter((p) => p.cycle === appCycle), [appAll, appCycle]);
  const agency = useMemo(() => agencyAll.filter((p) => p.cycle === "month"), [agencyAll]);

  function openGenericEditor() {
    setEditingPlanId("");
    setEditingPlanType(tab);
    setOpen(true);
  }

  function openSpecificPlan(plan: Plan) {
    setEditingPlanType(plan.type);
    setEditingPlanId(plan.id);
    setOpen(true);
  }

  function savePlan(planId: string, patch: Partial<Plan>, enforceSinglePopular: boolean) {
    const original = plans.find((p) => p.id === planId);
    if (!original) return;

    if (original.type === "agency") {
      const apiPatch: any = {
        description: patch.description ?? original.description,
        priceDisplay: {
          monthly: patch.price ?? original.price,
          currency: patch.currency ?? original.currency ?? "SGD",
        },
        isPopular: !!patch.popular,
        status: (patch.status ?? original.status ?? "active") as "active" | "inactive",
      };

      const stripePriceId = String(
        patch.stripePriceId ?? original.stripePriceId ?? ""
      ).trim();

      if (stripePriceId) {
        apiPatch.stripePriceId = stripePriceId;
      }

      console.log("AGENCY PATCH PAYLOAD", apiPatch);
      updateAgency.mutate({ id: planId, patch: apiPatch });
      return;
    }

    const apiPatch: any = {
      description: patch.description ?? original.description,
      price: patch.price ?? original.price,
      currency: patch.currency ?? original.currency ?? "USD",
      status: (patch.status ?? original.status ?? "active") as "active" | "inactive",
      isPopular: !!patch.popular,
    };

    const stripePriceId = String(
      patch.stripePriceId ?? original.stripePriceId ?? ""
    ).trim();

    if (stripePriceId) {
      apiPatch.stripePriceId = stripePriceId;
    }

    console.log("CUSTOMER PATCH PAYLOAD", apiPatch);

    updateCustomer.mutate(
      { id: planId, patch: apiPatch },
      {
        onSuccess: () => {
          if (enforceSinglePopular && patch.popular) {
            const otherPopularPlans = plans.filter(
              (p) => p.type === "app" && p.id !== planId && p.popular
            );

            otherPopularPlans.forEach((p) => {
              updateCustomer.mutate({
                id: p.id,
                patch: { isPopular: false },
              });
            });
          }
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Subscription Plans</div>
          <div className="text-sm text-muted-foreground">
            Manage pricing and features for your subscription plans
          </div>
        </div>

        <Button
          className="rounded-xl bg-orange-600 hover:bg-orange-600 gap-2"
          onClick={openGenericEditor}
          disabled={loading}
          type="button"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as PlanType)}>
        <TabsList className="bg-transparent p-0 gap-2">
          <TabsTrigger
            value="app"
            className="rounded-none data-[state=active]:text-orange-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
          >
            App Plans (B2C)
          </TabsTrigger>

          <TabsTrigger
            value="agency"
            className="rounded-none data-[state=active]:text-orange-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
          >
            Agency Plans (B2B)
          </TabsTrigger>
        </TabsList>

        <div className="border-b mt-3" />

        <TabsContent value="app" className="mt-6 space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl border bg-white p-1">
              <button
                className={[
                  "px-4 py-2 text-sm rounded-lg",
                  appCycle === "month" ? "bg-slate-900 text-white" : "text-slate-700",
                ].join(" ")}
                onClick={() => setAppCycle("month")}
                type="button"
              >
                Monthly
              </button>

              <button
                className={[
                  "px-4 py-2 text-sm rounded-lg",
                  appCycle === "year" ? "bg-slate-900 text-white" : "text-slate-700",
                ].join(" ")}
                onClick={() => setAppCycle("year")}
                type="button"
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading plans…</div>
            ) : app.length ? (
              app.map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  onChoosePlan={() => openSpecificPlan(p)}
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No {appCycle} plans found
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="agency" className="mt-8">
          <div className="flex justify-center gap-6 flex-wrap">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading plans…</div>
            ) : agency.length ? (
              agency.map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  onChoosePlan={() => openSpecificPlan(p)}
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No agency plans found</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <EditPlansDialog
        open={open}
        onOpenChange={setOpen}
        allPlans={plans}
        onSavePlan={savePlan}
        initialPlanId={editingPlanId}
        initialPlanType={editingPlanType}
      />
    </div>
  );
}