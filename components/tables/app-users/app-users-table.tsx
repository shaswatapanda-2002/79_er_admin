// components/tables/app-users/app-users-table.tsx
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, Eye, ShieldCheck, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AppUser, SubscriptionPlan as Subscription, UserStatus } from "./types";
import { StatusBadge, SubscriptionBadge } from "./badges";
import { UserDetailsDialog } from "./user-details-dialog";
import { toastError, toastSuccess } from "@/lib/toast";

import {
  useAdminUsersQuery,
  useSetAdminUserSuspendedMutation,
} from "@/src/queries/admin-users.queries";

// ---------- helpers ----------
function toDDMMYYYY(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function normalizeSubscription(plan?: string | null): Subscription {
  const p = (plan || "free").toLowerCase();
  if (p === "premium") return "premium";
  if (p === "pro") return "pro";
  if (p === "trial") return "trial";
  return "free";
}

function normalizeStatus(s?: string | null): UserStatus {
  return s === "suspended" ? "suspended" : "active";
}

function getInitials(name: string) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function AppUsersTable() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [planFilter, setPlanFilter] = useState<"all" | Subscription>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");

  // cache avatar after details fetch (customerId -> url)
  const [avatarById, setAvatarById] = useState<Record<string, string>>({});

  const usersQ = useAdminUsersQuery({ page, limit });
  const suspendMut = useSetAdminUserSuspendedMutation();

  const [selected, setSelected] = useState<AppUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const users: AppUser[] = useMemo(() => {
    const rows = usersQ.data?.data || [];
    return rows.map((u) => ({
      id: u.customerId,
      name: u.name || "-",
      email: u.email || "-",
      phone: null,
      avatarUrl: avatarById[u.customerId] || null,

      subscription: normalizeSubscription(u.subscription?.plan),
      subscriptionExpires: u.subscription?.endDate ? toDDMMYYYY(u.subscription.endDate) : null,

      status: normalizeStatus(u.userStatus),

      totalTrips: Number(u.totalTrips || 0),
      joined: toDDMMYYYY(u.joinedAt),
    }));
  }, [usersQ.data, avatarById]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    return users.filter((u) => {
      if (s && !(u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))) {
        return false;
      }
      if (planFilter !== "all" && u.subscription !== planFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [q, users, planFilter, statusFilter]);

  const total = usersQ.data?.total ?? 0;
  const totalPages = usersQ.data?.totalPages ?? 1;

  function openDetails(u: AppUser) {
    setSelected(u);
    setDetailsOpen(true);
  }

  function toggleStatus(u: AppUser) {
    // ✅ backend expects boolean in body: { suspended: true/false }
    const suspended = u.status === "active"; // active -> suspend, suspended -> unsuspend

    suspendMut.mutate(
      { customerId: u.id, suspended },
      {
        onSuccess: (res) => toastSuccess(res?.message || "Updated"),
        onError: (err) => toastError(err, "Failed to update status"),
      },
    );
  }

  function handleAvatarResolved(url: string) {
    if (!selected?.id) return;

    setAvatarById((prev) => {
      if (prev[selected.id] === url) return prev;
      return { ...prev, [selected.id]: url };
    });

    setSelected((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
  }

  const isLoading = usersQ.isLoading;
  const isError = usersQ.isError;
  const error = usersQ.error as any;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-semibold">App Users</div>
          <div className="text-sm text-muted-foreground">Manage your B2C user base</div>
        </div>

        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{total}</span> users
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
          <div className="w-full md:max-w-[420px]">
            <Input
              placeholder="Search by name or email..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="rounded-xl"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Select
              value={planFilter}
              onValueChange={(v) => {
                setPlanFilter(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-xl w-[170px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-xl w-[170px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setQ("");
                setPlanFilter("all");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              Reset
            </Button>

            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={() => usersQ.refetch()}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing: <span className="font-medium text-foreground">{filtered.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="w-[360px]">USER</TableHead>
              <TableHead>SUBSCRIPTION</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-center">TRIPS</TableHead>
              <TableHead>JOINED</TableHead>
              <TableHead className="text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-red-600">
                  {error?.message || "Failed to load users"}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filtered.map((u) => {
                  const initials = getInitials(u.name);

                  return (
                    <TableRow key={u.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {u.avatarUrl ? <AvatarImage src={u.avatarUrl} alt={u.name} /> : null}
                            <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">
                              {initials || "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <div className="font-medium leading-5">{u.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="space-y-1">
                        <SubscriptionBadge value={u.subscription} />
                        <div className="text-xs text-muted-foreground">
                          Expires: {u.subscriptionExpires || "-"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge value={u.status} />
                      </TableCell>

                      <TableCell className="text-center font-medium">{u.totalTrips}</TableCell>

                      <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>

                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted/30">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem onClick={() => openDetails(u)} className="gap-2">
                              <Eye className="h-4 w-4" /> View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => toggleStatus(u)}
                              className="gap-2"
                              disabled={suspendMut.isPending}
                            >
                              <ShieldCheck className="h-4 w-4" />
                              {u.status === "active" ? "Suspend User" : "Activate User"}
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
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page <span className="text-foreground font-medium">{page}</span> / {totalPages}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <UserDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={selected}
        onAvatarResolved={handleAvatarResolved}
        onEdit={() => {}}
        onResetPassword={() => {}}
        onToggleStatus={() => selected && toggleStatus(selected)}
        onActivityLogs={() => {}}
      />
    </div>
  );
}