"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DemoRequest, DemoStatus } from "./types";

export function EditDemoDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: DemoRequest | null;
  onSave: (patch: Partial<DemoRequest>) => void;
}) {
  const [agencyName, setAgencyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState<DemoStatus>("new");
  const [assignedTo, setAssignedTo] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (!item) return;
    setAgencyName(item.agencyName);
    setContactName(item.contactName);
    setEmail(item.contactEmail);
    setPhone(item.contactPhone);
    setStatus(item.status);
    setAssignedTo(item.assignedTo || "");
    setFollowUpDate(item.followUpDate || "");
    setAdminNotes(item.adminNotes || "");
  }, [item]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Edit Demo Request</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Agency Name</Label>
            <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Contact Name</Label>
            <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DemoStatus)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">new</SelectItem>
                <SelectItem value="contacted">contacted</SelectItem>
                <SelectItem value="scheduled">scheduled</SelectItem>
                <SelectItem value="completed">completed</SelectItem>
                <SelectItem value="rejected">rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Staff name" />
          </div>

          <div className="space-y-2">
            <Label>Follow-up Date</Label>
            <Input value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} placeholder="DD/MM/YYYY" />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label>Admin Notes</Label>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal notes about this request..."
            className="min-h-[110px] rounded-xl"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-orange-600 hover:bg-orange-600"
            onClick={() => {
              onSave({
                agencyName,
                contactName,
                contactEmail: email,
                contactPhone: phone,
                status,
                assignedTo: assignedTo || "Unassigned",
                followUpDate,
                adminNotes,
              });
              onOpenChange(false);
            }}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
