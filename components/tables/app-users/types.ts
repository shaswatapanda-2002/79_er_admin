export type UserStatus = "active" | "suspended";
export type Subscription = "premium" | "pro" | "trial" | "free";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;

  subscription: Subscription;
  subscriptionExpires?: string; // "15/06/2026"
  status: UserStatus;

  totalTrips: number;
  joined: string; // "15/03/2024"
  linkedAgency?: string; // "ag1"
};
