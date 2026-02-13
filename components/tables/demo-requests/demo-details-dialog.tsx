"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./badges";
import type { DemoRequest, DemoStatus } from "./types";
import { Calendar, Mail, Phone, Pencil, CheckCircle2, MessageSquare, XCircle } from "lucide-react";

export function DemoDetailsDialog({
  open,
  onOpenChange,
  item,
  onEdit,
  onSetStatus,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: DemoRequest | null;
  onEdit: () => void;
  onSetStatus: (s: DemoStatus) => void;
}) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] rounded-2xl p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base font-semibold">Demo Request Details</DialogTitle>
          </DialogHeader>

          <div className="mt-3 flex items-center justify-between">
            <StatusBadge status={item.status} />
            <div className="text-xs text-muted-foreground">Submitted: {item.date}</div>
          </div>

          <div className="mt-5 rounded-xl border bg-white p-4">
            <div className="text-sm font-semibold mb-3">Agency Details</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Agency Name</div>
                <div className="font-medium">{item.agencyName}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Agency Type</div>
                <div className="font-medium">{item.agencyType}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Website</div>
                {item.website ? (
                  <a className="font-medium text-orange-600" href={item.website} target="_blank">
                    {item.website}
                  </a>
                ) : (
                  <div className="font-medium text-muted-foreground">—</div>
                )}
              </div>
              <div>
                <div className="text-muted-foreground text-xs">City</div>
                <div className="font-medium">{item.city}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Country</div>
                <div className="font-medium">{item.country}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border bg-white p-4">
            <div className="text-sm font-semibold mb-3">Contact Person</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Full Name</div>
                <div className="font-medium">{item.contactName}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Role</div>
                <div className="font-medium">{item.contactRole}</div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-600" />
                <a className="font-medium text-orange-600" href={`mailto:${item.contactEmail}`}>
                  {item.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-600" />
                <a className="font-medium text-orange-600" href={`tel:${item.contactPhone}`}>
                  {item.contactPhone}
                </a>
              </div>
            </div>
          </div>

          {item.requestNotes ? (
            <div className="mt-4 rounded-xl border bg-white p-4">
              <div className="text-sm font-semibold mb-2">Request Notes</div>
              <div className="text-sm text-muted-foreground">{item.requestNotes}</div>
            </div>
          ) : null}

          <Separator className="my-5" />

          <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="rounded-xl gap-2" onClick={onEdit}>
              <Pencil className="h-4 w-4" /> Edit Request
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl gap-2 bg-yellow-50 hover:bg-yellow-50 text-yellow-700"
              onClick={() => onSetStatus("contacted")}
            >
              <MessageSquare className="h-4 w-4" /> Mark Contacted
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl gap-2 bg-purple-50 hover:bg-purple-50 text-purple-700"
              onClick={() => onSetStatus("scheduled")}
            >
              <Calendar className="h-4 w-4" /> Schedule Demo
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl gap-2 bg-green-50 hover:bg-green-50 text-green-700"
              onClick={() => onSetStatus("completed")}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Completed
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl gap-2 bg-red-50 hover:bg-red-50 text-red-700 col-span-2"
              onClick={() => onSetStatus("rejected")}
            >
              <XCircle className="h-4 w-4" /> Mark Rejected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
