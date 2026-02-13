export type PaymentStatus = "completed" | "pending" | "refunded";
export type PaymentType = "subscription" | "refund";

export type PaymentRow = {
  id: string;

  invoice: string;
  userLabel: string; // "User: u1" / "Agency: ag2"

  plan: string; // Premium / Enterprise / Plus / Pro
  type: PaymentType;

  amount: number; // USD
  method: "Credit Card" | "Bank Transfer" | "PayPal";

  status: PaymentStatus;
  date: string; // "01/02/2026"
};
