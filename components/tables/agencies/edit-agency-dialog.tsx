"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Agency, AgencyStatus, SubscriptionPlan, VerificationStatus } from "./types";

export function EditAgencyDialog({
  open,
  onOpenChange,
  agency,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agency: Agency | null;
  onSave: (patch: Partial<Agency>) => void;
}) {
  const [agencyName, setAgencyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [subscription, setSubscription] = useState<SubscriptionPlan>("basic");
  const [status, setStatus] = useState<AgencyStatus>("active");
  const [verification, setVerification] = useState<VerificationStatus>("pending");
  const [staffCount, setStaffCount] = useState<number>(0);

  useEffect(() => {
    if (!agency) return;
    setAgencyName(agency.name);
    setAdminName(agency.adminName);
    setEmail(agency.email);
    setPhone(agency.phone);
    setType(agency.type);
    setRegistrationNumber(agency.registrationNumber);
    setSubscription(agency.subscription);
    setStatus(agency.status);
    setVerification(agency.verification);
    setStaffCount(agency.staffCount);
  }, [agency]);

  if (!agency) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Edit Agency</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Agency Name</Label>
            <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Admin Name</Label>
            <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} />
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
            <Label>Business Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Subscription</Label>
            <Select value={subscription} onValueChange={(v) => setSubscription(v as SubscriptionPlan)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AgencyStatus)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="suspended">suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Verification</Label>
            <Select value={verification} onValueChange={(v) => setVerification(v as VerificationStatus)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">approved</SelectItem>
                <SelectItem value="pending">pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Staff Count</Label>
            <Input
              type="number"
              value={String(staffCount)}
              onChange={(e) => setStaffCount(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-indigo-600 hover:bg-indigo-600"
            onClick={() => {
              onSave({
                name: agencyName,
                adminName,
                email,
                phone,
                type,
                registrationNumber,
                subscription,
                status,
                verification,
                staffCount,
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
