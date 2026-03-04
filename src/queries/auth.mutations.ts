// ==========================================
// FILE 3: src/queries/auth.mutations.ts
// ==========================================
import { useMutation } from "@tanstack/react-query";
import {
  adminSignup,
  sendEmailVerifyOtp,
  verifyEmailOtp,
  adminLogin,
  type AdminSignupPayload,
  type SendEmailOtpPayload,
  type VerifyEmailOtpPayload,
  type AdminLoginPayload,
} from "@/src/services/auth.service";

import { toastSuccess, toastError } from "@/lib/toast";
import { useUiStore } from "@/lib/stores/ui.store";
import { useAuthStore } from "@/lib/auth/auth.store";

/* =========================
   CREATE ADMIN
========================= */

export function useAdminSignupMutation() {
  const start = useUiStore((s) => s.startLoading);
  const stop = useUiStore((s) => s.stopLoading);

  return useMutation({
    mutationFn: (payload: AdminSignupPayload) => adminSignup(payload),

    onMutate: () => start("Creating admin..."),

    onSuccess: (res) => {
      toastSuccess(res.message || "Admin created successfully");
    },

    onError: (err) => {
      toastError(err, "Failed to create admin");
    },

    onSettled: () => stop(),
  });
}

/* =========================
   SEND OTP
========================= */

export function useSendEmailOtpMutation() {
  const start = useUiStore((s) => s.startLoading);
  const stop = useUiStore((s) => s.stopLoading);

  return useMutation({
    mutationFn: (payload: SendEmailOtpPayload) => sendEmailVerifyOtp(payload),

    onMutate: () => start("Sending OTP..."),

    onSuccess: (res) => {
      toastSuccess(res.message || "OTP sent to email");
    },

    onError: (err) => {
      toastError(err, "Failed to send OTP");
    },

    onSettled: () => stop(),
  });
}

/* =========================
   VERIFY OTP
========================= */

export function useVerifyEmailOtpMutation() {
  const start = useUiStore((s) => s.startLoading);
  const stop = useUiStore((s) => s.stopLoading);

  return useMutation({
    mutationFn: (payload: VerifyEmailOtpPayload) => verifyEmailOtp(payload),

    onMutate: () => start("Verifying OTP..."),

    onSuccess: (res) => {
      toastSuccess(res.message || "Email verified successfully");
    },

    onError: (err) => {
      toastError(err, "OTP verification failed");
    },

    onSettled: () => stop(),
  });
}

/* =========================
   ADMIN LOGIN
========================= */

export function useAdminLoginMutation() {
  const start = useUiStore((s) => s.startLoading);
  const stop = useUiStore((s) => s.stopLoading);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminLogin(payload),

    onMutate: () => start("Signing in..."),

    onSuccess: (res) => {
      const token = res.data.token;
      const admin = res.data.admin;

      setAuth({
        token,
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      });

      toastSuccess(res.message || "Login successful");
    },

    onError: (err) => {
      toastError(err, "Login failed");
    },

    onSettled: () => stop(),
  });
}