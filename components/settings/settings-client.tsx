"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = "profile" | "security";

export default function SettingsClient() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="text-xl font-semibold">Settings</div>
        <div className="text-sm text-muted-foreground">
          Manage your admin account preferences
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
        {/* Sidebar Tabs */}
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-3 space-y-2">
            <button
              onClick={() => setTab("profile")}
              className={cn(
                "w-full text-left px-4 py-2 rounded-xl text-sm transition",
                tab === "profile"
                  ? "bg-orange-600 text-white"
                  : "hover:bg-muted",
              )}
            >
              Profile
            </button>

            <button
              onClick={() => setTab("security")}
              className={cn(
                "w-full text-left px-4 py-2 rounded-xl text-sm transition",
                tab === "security"
                  ? "bg-orange-600 text-white"
                  : "hover:bg-muted",
              )}
            >
              Security
            </button>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="rounded-xl border bg-white">
          <CardContent className="p-6">
            {tab === "profile" ? <ProfileSection /> : <SecuritySection />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */

function ProfileSection() {
  return (
    <div className="space-y-5">
      <div className="text-sm font-semibold">Profile Information</div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold">
          S
        </div>

        <Button variant="outline" className="rounded-xl">
          Change Photo
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Full Name</label>
          <Input defaultValue="Super Admin" className="rounded-xl mt-1" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Email Address</label>
          <Input
            defaultValue="superadmin@example.com"
            className="rounded-xl mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Role</label>
          <Input
            defaultValue="SUPER ADMIN"
            disabled
            className="rounded-xl mt-1 bg-muted"
          />
        </div>

        <Button className="rounded-xl bg-orange-600 hover:bg-orange-600">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* ---------------- SECURITY ---------------- */

function SecuritySection() {
  return (
    <div className="space-y-5">
      <div className="text-sm font-semibold">Security Settings</div>

      {/* Removed 2FA completely */}

      <div className="space-y-4">
        <div className="text-sm font-medium">Change Password</div>

        <div>
          <label className="text-xs text-muted-foreground">
            Current Password
          </label>
          <Input type="password" className="rounded-xl mt-1" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">
            New Password
          </label>
          <Input type="password" className="rounded-xl mt-1" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">
            Confirm New Password
          </label>
          <Input type="password" className="rounded-xl mt-1" />
        </div>

        <Button className="rounded-xl bg-orange-600 hover:bg-orange-600">
          Update Password
        </Button>
      </div>
    </div>
  );
}
