"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Eye, Pencil, RefreshCcw, ShieldBan } from "lucide-react";
import type { AppUser } from "./types";
import { StatusBadge, SubscriptionBadge } from "./badges";

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onActivityLogs,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: AppUser | null;

  onEdit: () => void;
  onResetPassword: () => void;
  onToggleStatus: () => void;
  onActivityLogs: () => void;
}) {
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base font-semibold">User Details</DialogTitle>
          </DialogHeader>

          <div className="mt-5 flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              {user.phone ? <div className="text-sm text-muted-foreground">{user.phone}</div> : null}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Subscription</div>
              <div><SubscriptionBadge value={user.subscription} /></div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Status</div>
              <div><StatusBadge value={user.status} /></div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Total Trips</div>
              <div className="font-medium">{user.totalTrips}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Member Since</div>
              <div className="font-medium">{user.joined}</div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Subscription Expires</div>
              <div className="font-medium">{user.subscriptionExpires || "-"}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Linked Agency</div>
              <div className="font-medium">{user.linkedAgency || "-"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-center gap-2 rounded-xl" onClick={onEdit}>
                <Pencil className="h-4 w-4" /> Edit User
              </Button>

              <Button variant="secondary" className="justify-center gap-2 rounded-xl" onClick={onActivityLogs}>
                <Eye className="h-4 w-4" /> Activity Logs
              </Button>

              <Button
                variant="secondary"
                className="justify-center gap-2 rounded-xl bg-green-50 hover:bg-green-50 text-green-700"
                onClick={onResetPassword}
              >
                <RefreshCcw className="h-4 w-4" /> Reset Password
              </Button>

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
