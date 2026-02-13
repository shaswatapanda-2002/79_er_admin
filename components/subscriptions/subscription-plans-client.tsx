"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Plan, PlanType } from "@/lib/subscription-plans";
import { PlanCard } from "./plan-card";
import { EditPlansDialog } from "./edit-plans-dialog";

export default function SubscriptionPlansClient({
  appPlans,
  agencyPlans,
}: {
  appPlans: Plan[];
  agencyPlans: Plan[];
}) {
  const [tab, setTab] = useState<PlanType>("app");
  const [open, setOpen] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([...appPlans, ...agencyPlans]);

  const app = useMemo(() => plans.filter((p) => p.type === "app"), [plans]);
  const agency = useMemo(() => plans.filter((p) => p.type === "agency"), [plans]);

  function savePlan(planId: string, patch: Partial<Plan>, enforceSinglePopular: boolean) {
    setPlans((prev) => {
      const updated = prev.map((p) => (p.id === planId ? { ...p, ...patch } : p));

      if (!enforceSinglePopular) return updated;

      // if this plan is now popular => ensure only one popular for its type
      const changed = updated.find((p) => p.id === planId);
      if (!changed?.popular) return updated;

      return updated.map((p) =>
        p.type === changed.type && p.id !== changed.id ? { ...p, popular: false } : p,
      );
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Subscription Plans</div>
          <div className="text-sm text-muted-foreground">
            Manage pricing and features for your subscription plans
          </div>
        </div>

        <Button
          className="rounded-xl bg-orange-600 hover:bg-orange-600 gap-2"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
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

        {/* App plans */}
        <TabsContent value="app" className="mt-8">
          <div className="flex justify-center gap-6 flex-wrap">
            {app.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </TabsContent>

        {/* Agency plans */}
        <TabsContent value="agency" className="mt-8">
          <div className="flex justify-center gap-6 flex-wrap">
            {agency.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit modal */}
      <EditPlansDialog
        open={open}
        onOpenChange={setOpen}
        allPlans={plans}
        onSavePlan={savePlan}
      />
    </div>
  );
}
