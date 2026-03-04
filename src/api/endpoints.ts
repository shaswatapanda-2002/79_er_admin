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
    ADMIN: "/api/admin/admin-dashboard",
  },

  APP_USERS: {
    LIST: "/api/admin/users",
    DETAILS: (customerId: string) => `/api/admin/users/${customerId}`,
    TOGGLE_SUSPEND: (customerId: string) => `/api/admin/users/${customerId}/suspend`,
  },

  // ✅ NEW
  AGENCIES: {
    SUMMARY: "/api/admin/agencies/summary",
    LIST: "/api/admin/allAgencies", // ?status=suspended&page=1&limit=10
    DETAILS: (agencyId: string) => `/api/admin/agencies/${agencyId}`,
    SUSPEND: (agencyId: string) => `/api/admin/agencies/${agencyId}/suspend`, // PATCH { suspended: true/false }
  },
  PAYMENTS: {
    SUMMARY: "/api/admin/payments/summary",
    LIST: "/api/admin/allPayments",
    EXPORT: "/api/admin/payments/export", // returns csv
  },
   ANALYTICS: {
    OVERVIEW: "/api/admin/analytics/overview",
  },
   SETTINGS: {
    PROFILE: "/api/admin/profile", // GET, PUT
    CHANGE_PASSWORD: "/api/admin/change-password", // PUT
  },
} as const;