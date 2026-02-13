"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, TypePill } from "./badges";
import type { PaymentRow, PaymentStatus } from "./types";
import { DollarSign, Clock3, FileText, RefreshCcw, Download } from "lucide-react";

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

export default function PaymentsClient({ initial }: { initial: PaymentRow[] }) {
  const [items] = useState<PaymentRow[]>(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => {
      const matchesSearch = !s || x.invoice.toLowerCase().includes(s);
      const matchesStatus = status === "all" ? true : x.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [items, q, status]);

  const stats = useMemo(() => {
    const totalRevenue = items
      .filter((x) => x.status === "completed" && x.type === "subscription")
      .reduce((acc, x) => acc + x.amount, 0);

    const pendingAmount = items
      .filter((x) => x.status === "pending")
      .reduce((acc, x) => acc + x.amount, 0);

    const totalTransactions = items.length;
    const refundsIssued = items.filter((x) => x.type === "refund" || x.status === "refunded").length;

    return { totalRevenue, pendingAmount, totalTransactions, refundsIssued };
  }, [items]);

  function exportCsv() {
    // simple client-side CSV for now
    const headers = ["Invoice", "Plan", "Type", "Amount", "Payment Method", "Status", "Date"];
    const rows = filtered.map((r) => [
      r.invoice,
      r.plan,
      r.type,
      r.amount,
      r.method,
      r.status,
      r.date,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="text-xl font-semibold">Payments &amp; Billing</div>
        <div className="text-sm text-muted-foreground">
          Track transactions, invoices, and revenue
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard
          value={money(stats.totalRevenue)}
          label="Total Revenue"
          icon={<DollarSign className="h-4 w-4 text-green-600" />}
        />
        <StatCard
          value={money(stats.pendingAmount)}
          label="Pending Amount"
          icon={<Clock3 className="h-4 w-4 text-yellow-600" />}
        />
        <StatCard
          value={`${stats.totalTransactions}`}
          label="Total Transactions"
          icon={<FileText className="h-4 w-4 text-blue-600" />}
        />
        <StatCard
          value={`${stats.refundsIssued}`}
          label="Refunds Issued"
          icon={<RefreshCcw className="h-4 w-4 text-purple-600" />}
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

        <Button className="rounded-xl bg-orange-600 hover:bg-orange-600 gap-2" onClick={exportCsv}>
          <Download className="h-4 w-4" />
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
