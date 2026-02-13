"use client";

import { useEffect, useMemo, useState } from "react";
import type { BillingCycle, Plan, PlanType } from "@/lib/subscription-plans";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function EditPlansDialog({
  open,
  onOpenChange,
  allPlans,
  onSavePlan,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  allPlans: Plan[];
  onSavePlan: (planId: string, patch: Partial<Plan>, enforceSinglePopular: boolean) => void;
}) {
  const [planType, setPlanType] = useState<PlanType>("app");
  const plansOfType = useMemo(() => allPlans.filter((p) => p.type === planType), [allPlans, planType]);

  const [selectedId, setSelectedId] = useState<string>("");

  const selected = useMemo(
    () => plansOfType.find((p) => p.id === selectedId) ?? null,
    [plansOfType, selectedId],
  );

  // form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [cycle, setCycle] = useState<BillingCycle>("month");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [popular, setPopular] = useState(false);

  useEffect(() => {
    // set default selection whenever type changes
    const first = plansOfType[0]?.id ?? "";
    setSelectedId(first);
  }, [planType, plansOfType]);

  useEffect(() => {
    if (!selected) return;
    setName(selected.name);
    setPrice(String(selected.price));
    setCycle(selected.cycle);
    setDescription(selected.description);
    setFeatures(selected.features);
    setPopular(!!selected.popular);
  }, [selected]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Edit Subscription Plans</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Type */}
          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Select value={planType} onValueChange={(v) => setPlanType(v as PlanType)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">App Plans (B2C)</SelectItem>
                <SelectItem value="agency">Agency Plans (B2B)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select plan */}
          <div className="space-y-2">
            <Label>Select Plan to Edit</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {plansOfType.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plan name */}
          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" placeholder="e.g., Premium Plan" />
          </div>

          {/* Price + Cycle row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl"
                inputMode="decimal"
              />
            </div>

            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={cycle} onValueChange={(v) => setCycle(v as BillingCycle)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl" />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features Description</Label>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="rounded-xl min-h-[110px]"
              placeholder="Unlock advanced planning tools..."
            />
          </div>

          {/* Popular */}
          <div className="flex items-center gap-2">
            <Checkbox id="popular" checked={popular} onCheckedChange={(v) => setPopular(Boolean(v))} />
            <Label htmlFor="popular" className="text-sm">
              Mark as Most Popular
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-orange-600 hover:bg-orange-600"
              onClick={() => {
                if (!selectedId) return;
                onSavePlan(
                  selectedId,
                  {
                    name,
                    price: Number(price || 0),
                    cycle,
                    description,
                    features,
                    popular,
                  },
                  true, // enforce single popular per type
                );
                onOpenChange(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
