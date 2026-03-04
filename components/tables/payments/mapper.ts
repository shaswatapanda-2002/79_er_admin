// components/tables/payments/mapper.ts
import type { PaymentRow } from "./types";

function fmtDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function mapPaymentRowToUI(row: any): PaymentRow {
  const invoice = row.invoiceNumber?.trim() ? row.invoiceNumber : row.sourceId;

  const kind = row.entity?.kind || row.type || "entity";
  const entityId = row.entity?.id || "-";

  return {
    id: String(row.sourceId || invoice),

    invoice,
    userLabel: `${String(kind).toUpperCase()}: ${entityId}`,

    plan: row.plan || "-",
    type: "subscription",

    amount: Number(row.amount ?? 0),
    method: "Credit Card", // backend doesn’t provide

    status: "completed", // backend doesn’t provide
    date: fmtDate(row.purchasedAt),
  };
}