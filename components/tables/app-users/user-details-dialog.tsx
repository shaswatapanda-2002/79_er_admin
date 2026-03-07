// components/tables/app-users/user-details-dialog.tsx
"use client";

import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Eye, Pencil, ShieldBan, Loader2 } from "lucide-react";
import type { AppUser } from "@/src/types/app-user.types";
import { StatusBadge, SubscriptionBadge } from "./badges";
import { useAdminUserDetailsQuery } from "@/src/queries/admin-users.queries";
import { toastError } from "@/lib/toast";

function toDDMMYYYY(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getInitials(name?: string | null) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onActivityLogs,
  onAvatarResolved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: AppUser | null;

  onEdit: () => void;
  onResetPassword: () => void;
  onToggleStatus: () => void;
  onActivityLogs: () => void;

  onAvatarResolved?: (url: string) => void;
}) {
  // ✅ keep hooks always called
  const customerId = user?.id ?? null;

  const detailsQ = useAdminUserDetailsQuery({
    customerId,
    enabled: open && !!customerId,
  });

  const details = detailsQ.data?.data;

  const initials = getInitials(user?.name);
  const profilePicture = details?.profilePicture || user?.avatarUrl || "";
  const phone = details?.mobile || user?.phone || "";
  const totalTrips = details?.trips?.totalTrips ?? user?.totalTrips ?? 0;
  const trips = details?.trips?.recentTrips ?? [];

  const planLabel = details?.subscription?.plan || user?.subscription || "-";
  const subStatus = details?.subscription?.status ?? "-";
  const startDate = details?.subscription?.startDate ?? null;
  const endDate = details?.subscription?.endDate ?? null;

  // ✅ prevent infinite loop: only push avatar when it CHANGES
  const lastPushedAvatarRef = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    if (!profilePicture) return;

    if (lastPushedAvatarRef.current === profilePicture) return;

    lastPushedAvatarRef.current = profilePicture;
    onAvatarResolved?.(profilePicture);
  }, [open, profilePicture, onAvatarResolved]);

  // ✅ toast error while open (only once per error)
  const lastToastKeyRef = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    if (!detailsQ.isError) return;

    const key = `${customerId || "none"}:${(detailsQ.error as any)?.message || "err"}`;
    if (lastToastKeyRef.current === key) return;

    lastToastKeyRef.current = key;
    toastError(detailsQ.error, "Failed to load user details");
  }, [open, detailsQ.isError, detailsQ.error, customerId]);

  // ✅ after hooks
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[820px] rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base font-semibold">User Details</DialogTitle>
          </DialogHeader>

          {/* Header */}
          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                {profilePicture ? <AvatarImage src={profilePicture} alt={user.name} /> : null}
                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                {phone ? <div className="text-sm text-muted-foreground">{phone}</div> : null}

                <div className="mt-2 text-xs text-muted-foreground">
                  {detailsQ.isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading full details...
                    </span>
                  ) : detailsQ.isError ? (
                    <span className="text-red-600">
                      {(detailsQ.error as any)?.message || "Failed to load details"}
                    </span>
                  ) : (
                    <span>Details loaded</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Subscription</div>
              <div>
                <SubscriptionBadge value={user.subscription} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Status</div>
              <div>
                <StatusBadge value={user.status} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Total Trips</div>
              <div className="font-medium">{totalTrips}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Member Since</div>
              <div className="font-medium">{user.joined}</div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Subscription details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Plan</div>
              <div className="font-medium">{String(planLabel)}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Sub Status</div>
              <div className="font-medium">{String(subStatus)}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Start Date</div>
              <div className="font-medium">{toDDMMYYYY(startDate)}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">End Date</div>
              <div className="font-medium">{toDDMMYYYY(endDate)}</div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Trips */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Recent Trips</div>
              <div className="text-xs text-muted-foreground">
                Total: <span className="text-foreground font-medium">{totalTrips}</span>
              </div>
            </div>

            <div className="rounded-xl border overflow-hidden">
              {detailsQ.isLoading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading trips...</div>
              ) : trips.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No recent trips.</div>
              ) : (
                <div className="divide-y">
                  {trips.map((t) => (
                    <div
                      key={t._id}
                      className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">{t.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {toDDMMYYYY(t.start_date)} → {toDDMMYYYY(t.end_date)}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Status: <span className="text-foreground font-medium">{t.tripStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="justify-center gap-2 rounded-xl bg-amber-50 hover:bg-amber-50 text-amber-700"
                onClick={onToggleStatus}
              >
                <ShieldBan className="h-4 w-4" />
                {user.status === "active" ? "Suspend" : "Activate"}
              </Button>


             
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}