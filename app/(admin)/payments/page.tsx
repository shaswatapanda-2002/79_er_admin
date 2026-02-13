import PaymentsClient from "@/components/tables/payments/payments-client";
import { MOCK_PAYMENTS } from "@/components/tables/payments/mock";

export default function PaymentsPage() {
  return <PaymentsClient initial={MOCK_PAYMENTS} />;
}
