"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toastError, toastSuccess } from "@/lib/toast";

import {
  useAdminProfileQuery,
  useChangePasswordMutation,
  useUpdateAdminProfileMutation,
} from "@/src/queries/settings.queries";

type Tab = "profile" | "security";

export default function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="text-xl font-semibold">Settings</div>
        <div className="text-sm text-muted-foreground">Manage your admin account preferences</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
        {/* Sidebar Tabs */}
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-3 space-y-2">
            <button
              onClick={() => setTab("profile")}
              className={cn(
                "w-full text-left px-4 py-2 rounded-xl text-sm transition",
                tab === "profile" ? "bg-orange-600 text-white" : "hover:bg-muted",
              )}
            >
              Profile
            </button>

            <button
              onClick={() => setTab("security")}
              className={cn(
                "w-full text-left px-4 py-2 rounded-xl text-sm transition",
                tab === "security" ? "bg-orange-600 text-white" : "hover:bg-muted",
              )}
            >
              Security
            </button>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-6">{tab === "profile" ? <ProfileSection /> : <SecuritySection />}</CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */

function initialsFromName(name?: string) {
  const n = (name || "").trim();
  if (!n) return "A";
  return n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function ProfileSection() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const profileQ = useAdminProfileQuery();
  const updateM = useUpdateAdminProfileMutation();

  const profile = profileQ.data?.data;

  const [fullName, setFullName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile?.fullName) setFullName(profile.fullName);
  }, [profile?.fullName]);

  const avatarPreview = useMemo(() => {
    if (selectedFile) return URL.createObjectURL(selectedFile);
    return profile?.avatarUrl || "";
  }, [selectedFile, profile?.avatarUrl]);

  useEffect(() => {
    return () => {
      if (selectedFile) URL.revokeObjectURL(avatarPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  async function onSave() {
    try {
      if (!fullName.trim()) {
        toastError("Full name is required");
        return;
      }
      await updateM.mutateAsync({ fullName: fullName.trim(), profileImage: selectedFile });
      toastSuccess("Profile updated");
      setSelectedFile(null);
    } catch (e: any) {
      toastError(e?.message || "Failed to update profile");
    }
  }

  const loading = profileQ.isLoading || updateM.isPending;

  return (
    <div className="space-y-5">
      <div className="text-sm font-semibold">Profile Information</div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {avatarPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarPreview}
            alt="avatar"
            className="h-14 w-14 rounded-full object-cover border"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold">
            {initialsFromName(fullName || profile?.fullName)}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setSelectedFile(f);
          }}
        />

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          Change Photo
        </Button>

        {selectedFile ? (
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setSelectedFile(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            disabled={loading}
          >
            Remove
          </Button>
        ) : null}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Full Name</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-xl mt-1"
            disabled={profileQ.isLoading}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Email Address</label>
          <Input value={profile?.email || ""} disabled className="rounded-xl mt-1 bg-muted" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Country Code</label>
            <Input value={profile?.countryCode || ""} disabled className="rounded-xl mt-1 bg-muted" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Mobile</label>
            <Input value={profile?.mobile || ""} disabled className="rounded-xl mt-1 bg-muted" />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Role</label>
          <Input value={(profile?.role || "").toUpperCase()} disabled className="rounded-xl mt-1 bg-muted" />
        </div>

        <Button
          className="rounded-xl bg-orange-600 hover:bg-orange-600"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

/* ---------------- SECURITY ---------------- */

function SecuritySection() {
  const changeM = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function onUpdatePassword() {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toastError("All password fields are required");
        return;
      }
      if (newPassword !== confirmPassword) {
        toastError("New password and confirm password must match");
        return;
      }

      await changeM.mutateAsync({ currentPassword, newPassword, confirmPassword });
      toastSuccess("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toastError(e?.message || "Failed to update password");
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-sm font-semibold">Security Settings</div>

      <div className="space-y-4">
        <div className="text-sm font-medium">Change Password</div>

        <div>
          <label className="text-xs text-muted-foreground">Current Password</label>
          <Input
            type="password"
            className="rounded-xl mt-1"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">New Password</label>
          <Input
            type="password"
            className="rounded-xl mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Confirm New Password</label>
          <Input
            type="password"
            className="rounded-xl mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          className="rounded-xl bg-orange-600 hover:bg-orange-600"
          onClick={onUpdatePassword}
          disabled={changeM.isPending}
        >
          {changeM.isPending ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}