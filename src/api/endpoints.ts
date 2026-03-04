// // ==========================================
// // FILE 1: src/api/endpoints.ts
// // ==========================================
// export const ENDPOINTS = {
//   ADMIN: {
//     CREATE: "/api/admin",
//     LOGIN: "/api/admin/login",
//   },

//   EMAIL_VERIFY: {
//     SEND_OTP: "/api/agent/email-verify-otp",
//     VERIFY_OTP: "/api/agent/otp-for-email-verify",
//   },
//    DASHBOARD: {
//     ADMIN: "/api/admin/admin-dashboard", // ✅ GET
//   },
//   adminUsers: {
//     list: "/api/admin/users",
//     details: (customerId: string) => `/api/admin/users/${customerId}`,
//     toggleSuspend: (customerId: string) => `/api/admin/users/${customerId}/suspend`,
//   },
// } as const;
// src/api/endpoints.ts
export const ENDPOINTS = {
  ADMIN: {
    CREATE: "/api/admin",
    LOGIN: "/api/admin/login",
  },

  EMAIL_VERIFY: {
    SEND_OTP: "/api/agent/email-verify-otp",
    VERIFY_OTP: "/api/agent/otp-for-email-verify",
  },

  DASHBOARD: {
    ADMIN: "/api/admin/admin-dashboard", // ✅ GET
  },

  APP_USERS: {
    LIST: "/api/admin/users",
    DETAILS: (customerId: string) => `/api/admin/users/${customerId}`,
    TOGGLE_SUSPEND: (customerId: string) => `/api/admin/users/${customerId}/suspend`,
  },
} as const;