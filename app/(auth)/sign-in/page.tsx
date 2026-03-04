// app/(auth)/sign-in/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminLoginMutation } from "@/src/queries/auth.mutations";
import { Mail, Lock } from "lucide-react";

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
      },
    );
  }

  return (
    <div className="min-h-[calc(100dvh-0px)] w-full flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-[420px] rounded-2xl border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <CardContent className="p-6 sm:p-7">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex items-center justify-center">
              {/* Put your logo in /public/logo.png (or change this path) */}
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <Image
                  src="/adminlogo.png"
                  alt="79er"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                  priority
                />
              </div>
            </div>

            <div className="text-xl font-semibold text-foreground">Admin Portal</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Sign in to access the dashboard
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-foreground/80">Email Address</div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-9 rounded-xl"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-foreground/80">Password</div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 rounded-xl"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}

            <Button
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-600"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>

            {/* Keep create admin button */}
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                onClick={() => router.push("/sign-up")}
              >
                Create admin
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}