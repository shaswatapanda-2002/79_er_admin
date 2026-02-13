// src/components/tables/agencies/agencies-client.tsx
"use client";

import { useMemo, useState } from "react";
import { StatCard } from "@/components/common/agencies/stat-card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, Eye, FileText, Trash2 } from "lucide-react";
import type { Agency, AgencyStatus, VerificationStatus } from "./types";
import { SubscriptionBadge, VerificationBadge, StatusBadge } from "./badges";
import { AgencyDetailsDialog } from "./agency-details-dialog";
import { EditAgencyDialog } from "./edit-agency-dialog";

function moneyUSD(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function AgenciesClient({ initial }: { initial: Agency[] }) {
  const [items, setItems] = useState<Agency[]>(initial);
  const [q, setQ] = useState("");

  // ✅ new dropdown filters
  const [statusFilter, setStatusFilter] = useState<"all" | AgencyStatus>("all");
  const [verificationFilter, setVerificationFilter] = useState<"all" | VerificationStatus>("all");

  const [selected, setSelected] = useState<Agency | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    return items.filter((a) => {
      const matchesSearch =
        !s || a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s);

      const matchesStatus = statusFilter === "all" ? true : a.status === statusFilter;
      const matchesVerification =
        verificationFilter === "all" ? true : a.verification === verificationFilter;

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [q, items, statusFilter, verificationFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((a) => a.status === "active").length;
    const pending = items.filter((a) => a.verification === "pending").length;
    const totalTrips = items.reduce((acc, a) => acc + a.totalTrips, 0);
    const totalRevenue = items.reduce((acc, a) => acc + a.revenueContribution, 0);

    return { total, active, pending, totalTrips, totalRevenue };
  }, [items]);

  function openDetails(a: Agency) {
    setSelected(a);
    setDetailsOpen(true);
  }

  function saveEdit(patch: Partial<Agency>) {
    if (!selected) return;
    setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)));
  }

  function toggleStatus(a: Agency) {
    // active <-> suspended, blocked stays blocked unless changed via edit
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== a.id) return x;
        if (x.status === "blocked") return x;
        return { ...x, status: x.status === "active" ? "suspended" : "active" };
      }),
    );
  }

  function viewDocs(a: Agency) {
    alert(`Open documents for ${a.name}`);
  }

  function deleteAgency(a: Agency) {
    if (confirm(`Delete agency "${a.name}"?`)) {
      setItems((prev) => prev.filter((x) => x.id !== a.id));
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Agencies</div>
          <div className="text-sm text-muted-foreground">Manage your B2B agency partners</div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Total: <span className="font-medium text-foreground">{stats.total}</span> agencies
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard value={`${stats.active}`} label="Active Agencies" />
        <StatCard value={`${stats.pending}`} label="Pending Verification" />
        <StatCard value={`${stats.totalTrips}`} label="Total Trips Created" />
        <StatCard value={moneyUSD(stats.totalRevenue)} label="Total Revenue" />
      </div>

      {/* Search + dropdown filters */}
      <div className="flex items-center gap-3">
        <div className="w-full max-w-[620px]">
          <Input
            placeholder="Search agencies..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Status */}
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="rounded-xl w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification */}
        <Select value={verificationFilter} onValueChange={(v) => setVerificationFilter(v as any)}>
          <SelectTrigger className="rounded-xl w-[210px]">
            <SelectValue placeholder="All Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verification</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="w-[360px]">AGENCY</TableHead>
              <TableHead>VERIFICATION</TableHead>
              <TableHead>SUBSCRIPTION</TableHead>
              <TableHead>PERFORMANCE</TableHead>
              <TableHead>REVENUE</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((a) => {
              const initials = a.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("");

              return (
                <TableRow key={a.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                          {initials || "A"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="font-medium leading-5">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.type}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <VerificationBadge value={a.verification} />
                  </TableCell>

                  <TableCell className="space-y-1">
                    <SubscriptionBadge value={a.subscription} />
                    <div className="text-xs">
                      <StatusBadge value={a.status} />
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    <div>↗ {a.totalTrips} trips</div>
                    <div>↗ {a.activeTravelers} travelers</div>
                  </TableCell>

                  <TableCell className="text-sm font-medium">{moneyUSD(a.revenueContribution)}</TableCell>

                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted/30">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem className="gap-2" onClick={() => openDetails(a)}>
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => viewDocs(a)}>
                          <FileText className="h-4 w-4" /> View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-red-600 focus:text-red-600"
                          onClick={() => deleteAgency(a)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Agency
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}

            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No agencies found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      {/* Details modal */}
      <AgencyDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        agency={selected}
        onEdit={() => {
          setDetailsOpen(false);
          setEditOpen(true);
        }}
        onViewDocs={() => selected && viewDocs(selected)}
        onToggleStatus={() => selected && toggleStatus(selected)}
      />

      {/* Edit modal */}
      <EditAgencyDialog open={editOpen} onOpenChange={setEditOpen} agency={selected} onSave={saveEdit} />
    </div>
  );
}
