"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, TypePill } from "./badges";
import type { PaymentRow, PaymentStatus } from "./types";
import { DollarSign, FileText, Download, Loader2 } from "lucide-react";

import { usePaymentsListQuery, usePaymentsSummaryQuery } from "@/src/queries/payments.queries";
import { mapPaymentRowToUI } from "./mapper";
import { http } from "@/lib/http/client";
import { ENDPOINTS } from "@/src/api/endpoints";
import { toastError } from "@/lib/toast";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <Card className="rounded-xl border bg-white shadow-sm">
      <CardContent className="p-4 flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentsClient() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");

  const summaryQ = usePaymentsSummaryQuery();
  const listQ = usePaymentsListQuery({ page: 1, limit: 50 });

  const items: PaymentRow[] = useMemo(() => {
    const rows = listQ.data?.data || [];
    return rows.map(mapPaymentRowToUI);
  }, [listQ.data]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => {
      const matchesSearch = !s || (x.invoice || "").toLowerCase().includes(s);
      const matchesStatus = status === "all" ? true : x.status === status; // frontend-only for now
      return matchesSearch && matchesStatus;
    });
  }, [items, q, status]);

  const stats = useMemo(() => {
    const api = summaryQ.data?.data;
    if (api) {
      return {
        totalRevenue: api.totalRevenue,
        totalTransactions: api.totalTransactions,
      };
    }
    return {
      totalRevenue: 0,
      totalTransactions: items.length,
    };
  }, [summaryQ.data, items.length]);

  const loading = summaryQ.isLoading || listQ.isLoading;

  async function exportCsvFromServer() {
    try {
      // Use axios instance to keep auth header + baseURL
      const res = await http.get(ENDPOINTS.PAYMENTS.EXPORT, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "payments.csv";
      a.click();

      URL.revokeObjectURL(url);
    } catch (e: any) {
      toastError(e?.message || "Failed to export CSV");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="text-xl font-semibold">Payments &amp; Billing</div>
        <div className="text-sm text-muted-foreground">Track transactions, invoices, and revenue</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard
          value={loading ? "…" : money(stats.totalRevenue)}
          label="Total Revenue"
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
        />
        <StatCard
          value={loading ? "…" : `${stats.totalTransactions}`}
          label="Total Transactions"
          icon={<FileText className="h-4 w-4 text-blue-600" />}
        />
      </div>

      {/* Search + Status + Export */}
      <div className="flex items-center gap-3">
        <div className="w-full">
          <Input
            placeholder="Search by invoice number..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="rounded-xl w-[170px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="rounded-xl bg-orange-600 hover:bg-orange-600 gap-2"
          onClick={exportCsvFromServer}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[210px]">INVOICE</TableHead>
              <TableHead>PLAN</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>PAYMENT METHOD</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>DATE</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Loading payments...
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="font-medium">{r.invoice}</div>
                      <div className="text-xs text-muted-foreground">{r.userLabel}</div>
                    </TableCell>

                    <TableCell className="text-sm">{r.plan}</TableCell>
                    <TableCell>
                      <TypePill type={r.type} />
                    </TableCell>

                    <TableCell className="text-sm font-medium">{money(r.amount)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.method}</TableCell>

                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}