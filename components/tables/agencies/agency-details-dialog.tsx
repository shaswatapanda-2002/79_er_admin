"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Pencil, ShieldBan } from "lucide-react";
import type { Agency } from "./types";
import { StatusBadge, SubscriptionBadge, VerificationBadge } from "./badges";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function AgencyDetailsDialog({
  open,
  onOpenChange,
  agency,
  onEdit,
  onViewDocs,
  onToggleStatus,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agency: Agency | null;

  onEdit: () => void;
  onViewDocs: () => void;
  onToggleStatus: () => void;
}) {
  if (!agency) return null;

  const initials = agency.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

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

          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Admin Name</div>
              <div className="font-medium">{agency.adminName}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium">{agency.email}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Phone</div>
              <div className="font-medium">{agency.phone}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Registration Number</div>
              <div className="font-medium">{agency.registrationNumber}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Subscription Plan</div>
              <div className="flex items-center gap-2">
                <SubscriptionBadge value={agency.subscription} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Staff Count</div>
              <div className="font-medium">{agency.staffCount}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Total Trips</div>
              <div className="font-medium">{agency.totalTrips}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Active Travelers</div>
              <div className="font-medium">{agency.activeTravelers}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Revenue Contribution</div>
              <div className="font-medium">{money(agency.revenueContribution)}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Joined</div>
              <div className="font-medium">{agency.joined}</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="rounded-xl gap-2" onClick={onEdit}>
              <Pencil className="h-4 w-4" /> Edit Agency
            </Button>

            <Button variant="secondary" className="rounded-xl gap-2" onClick={onViewDocs}>
              <FileText className="h-4 w-4" /> View Documents
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl gap-2 bg-amber-50 hover:bg-amber-50 text-amber-700 col-span-2"
              onClick={onToggleStatus}
            >
              <ShieldBan className="h-4 w-4" />
              {agency.status === "active" ? "Suspend" : "Activate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
