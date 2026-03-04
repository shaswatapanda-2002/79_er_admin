"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, ShieldBan, Loader2 } from "lucide-react";
import type { Agency } from "./types";
import { StatusBadge, SubscriptionBadge, VerificationBadge } from "./badges";

import { useAgencyDetailsQuery, useToggleAgencySuspendMutation } from "@/src/queries/agencies.queries";
import { toastSuccess, toastError } from "@/lib/toast";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function AgencyDetailsDialog({
  open,
  onOpenChange,
  agency,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agency: Agency | null;
}) {
  const agencyId = agency?.id || null;

  const detailsQ = useAgencyDetailsQuery(agencyId, open);
  const toggleM = useToggleAgencySuspendMutation();

  const d = detailsQ.data?.data?.data;

  if (!agency) return null;

  const initials = agency.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const isSuspended = Boolean(d?.isSuspended) || agency.status === "suspended";

  async function onToggleSuspend() {
    if (!agencyId) return;
    try {
      await toggleM.mutateAsync({ agencyId, suspended: !isSuspended });
      toastSuccess(!isSuspended ? "Agency suspended" : "Agency unsuspended");
      // keep dialog open; detailsQ will refresh via invalidation
    } catch (e: any) {
      toastError(e?.message || "Failed to update agency status");
    }
  }

  function onViewDocs() {
    const docs = d?.documents || [];
    if (!docs.length) {
      toastError("No documents found");
      return;
    }
    // simplest: open first doc
    window.open(docs[0].storagePath, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base font-semibold">Agency Details</DialogTitle>
          </DialogHeader>

          <div className="mt-5 flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                {initials || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="font-semibold">{agency.name}</div>
              <div className="text-sm text-muted-foreground">{agency.type}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <VerificationBadge value={agency.verification} />
                <StatusBadge value={agency.status} />
              </div>
            </div>
          </div>

          {detailsQ.isLoading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading full agency details...
            </div>
          ) : detailsQ.isError ? (
            <div className="mt-6 rounded-xl border p-3 text-sm text-red-600 bg-red-50">
              {detailsQ.error?.message || "Failed to load agency details"}
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Owner Name</div>
                  <div className="font-medium">{d?.owner?.fullName || agency.adminName}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{d?.owner?.email || agency.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Phone</div>
                  <div className="font-medium">{d?.owner?.phoneE164 || agency.phone}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Registration Number</div>
                  <div className="font-medium">{d?.registrationNumber || agency.registrationNumber}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Subscription Plan</div>
                  <div className="flex items-center gap-2">
                    <SubscriptionBadge value={agency.subscription} />
                    <span className="text-xs text-muted-foreground">
                      {d?.subscription?.subStatus ? `(${d.subscription.subStatus})` : ""}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Total Trips</div>
                  <div className="font-medium">{d?.metrics?.totalTrips ?? agency.totalTrips}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Active Travelers</div>
                  <div className="font-medium">{d?.metrics?.activeTravelers ?? agency.activeTravelers}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-muted-foreground">Revenue Contribution</div>
                  <div className="font-medium">{money(d?.metrics?.revenueContribution ?? agency.revenueContribution)}</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="rounded-xl gap-2" onClick={onViewDocs}>
                  <FileText className="h-4 w-4" /> View Documents
                </Button>

                <Button
                  variant="secondary"
                  className="rounded-xl gap-2 bg-amber-50 hover:bg-amber-50 text-amber-700"
                  onClick={onToggleSuspend}
                  disabled={toggleM.isPending}
                >
                  {toggleM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldBan className="h-4 w-4" />}
                  {isSuspended ? "Unsuspend" : "Suspend"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}