// ==========================================
// FILE 2: src/services/auth.service.ts
// ==========================================
import { apiPost } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";

/* =========================
   TYPES
========================= */

// ✅ Admin Signup
export type AdminSignupPayload = {
  fullName: string;
  mobile: string;
  password: string;
  email: string;
  countryCode: string;
};

export type AdminSignupResponse = {
  success: boolean;
  message: string;
  data: {
    adminId: string;
  };
};

// ✅ Send Email OTP
export type SendEmailOtpPayload = {
  email: string;
};

export type SendEmailOtpResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    email: string;
  };
};

// ✅ Verify Email OTP
export type VerifyEmailOtpPayload = {
  email: string;
  otp: string;
};

export type VerifyEmailOtpResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    email: string;
  };
};

// ✅ Admin Login
export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    admin: {
      id: string;
      fullName: string;
      email: string;
      countryCode: string;
      mobile: string;
      role: string;
    };
  };
};

/* =========================
   SERVICE FUNCTIONS
========================= */

// 1️⃣ Create Admin
export function adminSignup(payload: AdminSignupPayload) {
  return apiPost<AdminSignupResponse>(ENDPOINTS.ADMIN.CREATE, payload);
}

// 2️⃣ Send OTP
export function sendEmailVerifyOtp(payload: SendEmailOtpPayload) {
  return apiPost<SendEmailOtpResponse>(ENDPOINTS.EMAIL_VERIFY.SEND_OTP, payload);
}

// 3️⃣ Verify OTP
export function verifyEmailOtp(payload: VerifyEmailOtpPayload) {
  return apiPost<VerifyEmailOtpResponse>(
    ENDPOINTS.EMAIL_VERIFY.VERIFY_OTP,
    payload
  );
}

// 4️⃣ Admin Login
export function adminLogin(payload: AdminLoginPayload) {
  return apiPost<AdminLoginResponse>(ENDPOINTS.ADMIN.LOGIN, payload);
}