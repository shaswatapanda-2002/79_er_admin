"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Pencil, MessageSquare, Calendar, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import type { DemoRequest, DemoStatus } from "./types";
import { StatusBadge } from "./badges";
import { DemoDetailsDialog } from "./demo-details-dialog";
import { EditDemoDialog } from "./edit-demo-dialog";

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="rounded-xl border bg-white shadow-sm">
      <CardContent className="p-4 flex items-start gap-2">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="text-lg font-semibold leading-6">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DemoRequestsClient({ initial }: { initial: DemoRequest[] }) {
  const [items, setItems] = useState<DemoRequest[]>(initial);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DemoStatus>("all");

  const [selected, setSelected] = useState<DemoRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const stats = useMemo(() => {
    const count = (s: DemoStatus) => items.filter((x) => x.status === s).length;
    return {
      total: items.length,
      newReq: count("new"),
      contacted: count("contacted"),
      scheduled: count("scheduled"),
      completed: count("completed"),
      rejected: count("rejected"),
    };
  }, [items]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((x) => {
      const matchesSearch =
        !s ||
        x.agencyName.toLowerCase().includes(s) ||
        x.contactName.toLowerCase().includes(s) ||
        x.contactEmail.toLowerCase().includes(s);

      const matchesStatus = statusFilter === "all" ? true : x.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, q, statusFilter]);

  function openDetails(item: DemoRequest) {
    setSelected(item);
    setDetailsOpen(true);
  }

  function openEdit(item: DemoRequest) {
    setSelected(item);
    setEditOpen(true);
  }

  function setItemStatus(item: DemoRequest, status: DemoStatus) {
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status } : x)));
  }

  function saveEdit(patch: Partial<DemoRequest>) {
    if (!selected) return;
    setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)));
  }

  function deleteRequest(item: DemoRequest) {
    if (confirm(`Delete demo request from "${item.agencyName}"?`)) {
      setItems((prev) => prev.filter((x) => x.id !== item.id));
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">Demo Requests</div>
          <div className="text-sm text-muted-foreground">
            Manage agency demo requests from your website
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          Total: <span className="font-medium text-foreground">{stats.total}</span> requests
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <StatCard icon={<span className="text-blue-600">ⓘ</span>} value={stats.newReq} label="New Requests" />
        <StatCard icon={<span className="text-yellow-600">✉</span>} value={stats.contacted} label="Contacted" />
        <StatCard icon={<span className="text-purple-600">▣</span>} value={stats.scheduled} label="Scheduled" />
        <StatCard icon={<span className="text-green-600">✓</span>} value={stats.completed} label="Completed" />
        <StatCard icon={<span className="text-red-600">⨯</span>} value={stats.rejected} label="Rejected" />
      </div>

      {/* Search + Status filter (after search like Figma) */}
      <div className="flex items-center gap-3">
        <div className="w-full max-w-[720px]">
          <Input
            placeholder="Search by agency, contact name, or email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="rounded-xl w-[190px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">AGENCY</TableHead>
              <TableHead className="w-[260px]">CONTACT PERSON</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ASSIGNED TO</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/20">
                <TableCell>
                  <div className="font-medium">{r.agencyName}</div>
                  <div className="text-xs text-muted-foreground">{r.agencyType}</div>
                </TableCell>

                <TableCell>
                  <div className="font-medium">{r.contactName}</div>
                  <div className="text-xs text-muted-foreground">{r.contactRole}</div>
                  <div className="text-xs text-muted-foreground">{r.contactEmail}</div>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  <div>{r.city}, {r.country}</div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">{r.assignedTo || "Unassigned"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>

                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted/30">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 rounded-xl">
                      <DropdownMenuItem className="gap-2" onClick={() => openDetails(r)}>
                        <Eye className="h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" /> Edit Request
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-2 text-yellow-700" onClick={() => setItemStatus(r, "contacted")}>
                        <MessageSquare className="h-4 w-4" /> Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-purple-700" onClick={() => setItemStatus(r, "scheduled")}>
                        <Calendar className="h-4 w-4" /> Mark as Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-green-700" onClick={() => setItemStatus(r, "completed")}>
                        <CheckCircle2 className="h-4 w-4" /> Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-700" onClick={() => setItemStatus(r, "rejected")}>
                        <XCircle className="h-4 w-4" /> Mark as Rejected
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="gap-2 text-red-600 focus:text-red-600"
                        onClick={() => deleteRequest(r)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete Request
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No demo requests found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      {/* Details modal */}
      <DemoDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        item={selected}
        onEdit={() => {
          setDetailsOpen(false);
          setEditOpen(true);
        }}
        onSetStatus={(s) => selected && setItemStatus(selected, s)}
      />

      {/* Edit modal */}
      <EditDemoDialog open={editOpen} onOpenChange={setEditOpen} item={selected} onSave={saveEdit} />
    </div>
  );
}
