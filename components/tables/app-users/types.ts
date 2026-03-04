// ==========================================
// src/types/app-user.types.ts
// ==========================================

/**
 * Possible user account states
 */
export type UserStatus = "active" | "suspended";

/**
 * Supported subscription plans
 */
export type SubscriptionPlan = "free" | "trial" | "pro" | "premium";

/**
 * Core user model used in Admin UI
 */
export interface AppUser {
  /** Backend unique id (customerId) */
  id: string;

  /** Full name of the user */
  name: string;

  /** User email */
  email: string;

  /** Optional phone number */
  phone?: string | null;

  /** Cached profile picture (resolved after details API) */
  avatarUrl?: string | null;

  /** Subscription plan */
  subscription: SubscriptionPlan;

  /** Subscription expiry date (formatted for UI) */
  subscriptionExpires?: string | null;

  /** Account status */
  status: UserStatus;

  /** Total trips created by the user */
  totalTrips: number;

  /** Joined date (formatted for UI) */
  joined: string;
}