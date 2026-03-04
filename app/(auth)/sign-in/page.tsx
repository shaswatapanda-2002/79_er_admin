// ==========================================
// FILE 4: app/(auth)/sign-in/page.tsx
// (Updated to use useAdminLoginMutation - no fetch)
// ==========================================
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLoginMutation } from "@/src/queries/auth.mutations";

export default function SignInPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  const login = useAdminLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    login.mutate(
      { email: email.trim().toLowerCase(), password },
      {
        onSuccess: () => {
          router.push(next);
          router.refresh();
        },
        onError: (e: any) => setErr(e?.message || "Login failed"),
      }
    );
  }

  return (
    <Card className="w-full max-w-[420px] rounded-2xl shadow-sm border">
      <CardHeader className="space-y-1">
        <div className="text-center">
          <div className="text-xl font-semibold">Admin Sign in</div>
          <div className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </div>

          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <Button className="w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => router.push("/sign-up")}
            >
              Create admin
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}