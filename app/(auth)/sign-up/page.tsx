// ==========================================
// FILE 5: app/(auth)/sign-up/page.tsx
// (Signup + Send OTP + Verify OTP flow)
// ==========================================
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useAdminSignupMutation,
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from "@/src/queries/auth.mutations";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

type Step = "CREATE_ADMIN" | "OTP" | "DONE";

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/sign-in";

  const createAdmin = useAdminSignupMutation();
  const sendOtp = useSendEmailOtpMutation();
  const verifyOtp = useVerifyEmailOtpMutation();

  const [step, setStep] = useState<Step>("CREATE_ADMIN");

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const busy = createAdmin.isPending || sendOtp.isPending || verifyOtp.isPending;

  const canCreate = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      countryCode.trim().startsWith("+") &&
      mobile.trim().length >= 6 &&
      isEmail(normalizedEmail) &&
      password.length >= 6 &&
      !busy
    );
  }, [fullName, countryCode, mobile, normalizedEmail, password, busy]);

  const canVerifyOtp = useMemo(() => {
    return isEmail(normalizedEmail) && otp.trim().length >= 4 && !busy;
  }, [normalizedEmail, otp, busy]);

  function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const name = fullName.trim();
    const cc = countryCode.trim();
    const mob = mobile.trim();
    const em = normalizedEmail;

    if (name.length < 2) return setErr("Full name must be at least 2 characters.");
    if (!cc.startsWith("+")) return setErr("Country code must start with + (example: +91).");
    if (mob.length < 6) return setErr("Enter a valid mobile number.");
    if (!isEmail(em)) return setErr("Enter a valid email address.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");

    createAdmin.mutate(
      { fullName: name, countryCode: cc, mobile: mob, email: em, password },
      {
        onSuccess: () => {
          sendOtp.mutate(
            { email: em },
            {
              onSuccess: () => setStep("OTP"),
              onError: (e: any) => setErr(e?.message || "Failed to send OTP"),
            }
          );
        },
        onError: (e: any) => setErr(e?.message || "Failed to create admin"),
      }
    );
  }

  function handleResendOtp() {
    setErr(null);
    const em = normalizedEmail;
    if (!isEmail(em)) return setErr("Enter a valid email address.");
    sendOtp.mutate(
      { email: em },
      { onError: (e: any) => setErr(e?.message || "Failed to resend OTP") }
    );
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const em = normalizedEmail;
    const code = otp.trim();

    if (!isEmail(em)) return setErr("Enter a valid email address.");
    if (code.length < 4) return setErr("Enter a valid OTP.");

    verifyOtp.mutate(
      { email: em, otp: code },
      {
        onSuccess: () => {
          setStep("DONE");
          router.push(next);
          router.refresh();
        },
        onError: (e: any) => setErr(e?.message || "OTP verification failed"),
      }
    );
  }

  return (
    <Card className="w-full max-w-[460px] rounded-2xl shadow-sm border">
      <CardHeader className="space-y-1">
        <div className="text-center">
          <div className="text-xl font-semibold">Create Admin</div>
          <div className="text-sm text-muted-foreground">
            {step === "CREATE_ADMIN"
              ? "Create your admin account to continue."
              : step === "OTP"
              ? "Verify your email using the OTP sent to your inbox."
              : "Done"}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {step === "CREATE_ADMIN" ? (
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alok Kumar"
                autoComplete="name"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Country code</Label>
                <Input
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  placeholder="+91"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Mobile</Label>
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="7735159565"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                inputMode="email"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <div className="text-xs text-muted-foreground">Minimum 6 characters</div>
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}

            <Button className="w-full" disabled={!canCreate}>
              {createAdmin.isPending
                ? "Creating admin..."
                : sendOtp.isPending
                ? "Sending OTP..."
                : "Create admin & Send OTP"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="underline underline-offset-4 text-foreground"
                onClick={() => router.push(`/sign-in?next=${encodeURIComponent(next)}`)}
                disabled={busy}
              >
                Back to sign in
              </button>
            </div>
          </form>
        ) : step === "OTP" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled />
              <div className="text-xs text-muted-foreground">
                OTP sent to <b>{normalizedEmail}</b>
              </div>
            </div>

            <div className="space-y-2">
              <Label>OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}

            <Button className="w-full" disabled={!canVerifyOtp}>
              {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="underline underline-offset-4 text-foreground"
                onClick={() => setStep("CREATE_ADMIN")}
                disabled={busy}
              >
                Edit details
              </button>

              <button
                type="button"
                className="underline underline-offset-4 text-foreground"
                onClick={handleResendOtp}
                disabled={busy}
              >
                {sendOtp.isPending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-center">
            <div className="text-base font-semibold">Email verified ✅</div>
            <div className="text-sm text-muted-foreground">
              Redirecting to sign in...
            </div>
            <Button className="w-full" onClick={() => router.push(next)}>
              Go to sign in
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}