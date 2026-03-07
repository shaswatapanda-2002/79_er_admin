"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useAdminSignupMutation,
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
} from "@/src/queries/auth.mutations";

import { Mail, Lock, User, Phone, Hash } from "lucide-react";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

type Step = "FORM" | "OTP";

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/sign-in";

  const createAdmin = useAdminSignupMutation();
  const sendOtp = useSendEmailOtpMutation();
  const verifyOtp = useVerifyEmailOtpMutation();

  const [step, setStep] = useState<Step>("FORM");

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const busy = sendOtp.isPending || verifyOtp.isPending || createAdmin.isPending;

  function validateForm() {
    if (fullName.trim().length < 2) return "Full name must be at least 2 characters.";
    if (!countryCode.trim().startsWith("+")) return "Country code must start with + (example: +91).";
    if (mobile.trim().length < 6) return "Enter a valid mobile number.";
    if (!isEmail(normalizedEmail)) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  const canSendOtp = useMemo(() => {
    return !busy && validateForm() === null;
  }, [busy, fullName, countryCode, mobile, normalizedEmail, password]);

  const canVerifyOtp = useMemo(() => {
    return !busy && isEmail(normalizedEmail) && otp.trim().length >= 4;
  }, [busy, normalizedEmail, otp]);

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const msg = validateForm();
    if (msg) return setErr(msg);

    sendOtp.mutate(
      { email: normalizedEmail },
      {
        onSuccess: () => setStep("OTP"),
        onError: (e: any) => setErr(e?.message || "Failed to send OTP"),
      },
    );
  }

  function handleResendOtp() {
    setErr(null);
    if (!isEmail(normalizedEmail)) return setErr("Enter a valid email address.");

    sendOtp.mutate(
      { email: normalizedEmail },
      { onError: (e: any) => setErr(e?.message || "Failed to resend OTP") },
    );
  }

  function handleVerifyAndCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const msg = validateForm();
    if (msg) return setErr(msg);

    const code = otp.trim();
    if (code.length < 4) return setErr("Enter a valid OTP.");

    // 1) verify otp
    verifyOtp.mutate(
      { email: normalizedEmail, otp: code },
      {
        onSuccess: () => {
          // 2) create admin
          createAdmin.mutate(
            {
              fullName: fullName.trim(),
              countryCode: countryCode.trim(),
              mobile: mobile.trim(),
              email: normalizedEmail,
              password,
            },
            {
              onSuccess: () => {
                router.push(next);
                router.refresh();
              },
              onError: (e: any) => setErr(e?.message || "Failed to create admin"),
            },
          );
        },
        onError: (e: any) => setErr(e?.message || "OTP verification failed"),
      },
    );
  }

  return (
    <div className="min-h-[calc(100dvh-0px)] w-full flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-[460px] rounded-2xl border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <CardContent className="p-6 sm:p-7">
          {/* Logo + Title */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex items-center justify-center">
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
              {step === "FORM"
                ? "Create admin (verify email first)"
                : "Enter OTP sent to your email"}
            </div>
          </div>

          {step === "FORM" ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-foreground/80">Full Name</div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alok Kumar"
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>

              {/* Country + Mobile */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-foreground/80">Code</div>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      placeholder="+91"
                      className="pl-9 rounded-xl"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <div className="text-xs font-medium text-foreground/80">Mobile</div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="7735159565"
                      inputMode="numeric"
                      className="pl-9 rounded-xl"
                    />
                  </div>
                </div>
              </div>

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
                  />
                </div>
                <div className="text-xs text-muted-foreground">Minimum 6 characters</div>
              </div>

              {err ? <div className="text-sm text-red-600">{err}</div> : null}

              <Button
                className="w-full rounded-xl bg-orange-600 hover:bg-orange-600"
                disabled={!canSendOtp}
              >
                {sendOtp.isPending ? "Sending OTP..." : "Send OTP"}
              </Button>

              <div className="pt-1 flex justify-between text-sm">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                  onClick={() => router.push(`/sign-in?next=${encodeURIComponent(next)}`)}
                  disabled={busy}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCreate} className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-medium text-foreground/80">Email Address</div>
                <Input value={normalizedEmail} disabled className="rounded-xl bg-muted" />
                <div className="text-xs text-muted-foreground">
                  OTP sent to <b>{normalizedEmail}</b>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-foreground/80">OTP</div>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  inputMode="numeric"
                  className="rounded-xl"
                />
              </div>

              {err ? <div className="text-sm text-red-600">{err}</div> : null}

              <Button
                className="w-full rounded-xl bg-orange-600 hover:bg-orange-600"
                disabled={!canVerifyOtp}
              >
                {verifyOtp.isPending
                  ? "Verifying..."
                  : createAdmin.isPending
                  ? "Creating admin..."
                  : "Verify OTP & Create Admin"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                  onClick={() => setStep("FORM")}
                  disabled={busy}
                >
                  Edit details
                </button>

                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                  onClick={handleResendOtp}
                  disabled={busy}
                >
                  {sendOtp.isPending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}