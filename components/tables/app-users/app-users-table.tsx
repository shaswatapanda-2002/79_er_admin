"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Eye, Pencil, RefreshCcw, Trash2, ShieldCheck } from "lucide-react";
import type { AppUser } from "./types";
import { StatusBadge, SubscriptionBadge } from "./badges";
import { UserDetailsDialog } from "./user-details-dialog";
import { EditUserDialog } from "./edit-user-dialog";

export default function AppUsersTable({ initialUsers }: { initialUsers: AppUser[] }) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [q, setQ] = useState("");

  const [selected, setSelected] = useState<AppUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }, [q, users]);

  function openDetails(u: AppUser) {
    setSelected(u);
    setDetailsOpen(true);
  }
  function openEdit(u: AppUser) {
    setSelected(u);
    setEditOpen(true);
  }

  function saveEdit(patch: Partial<AppUser>) {
    if (!selected) return;
    setUsers((prev) => prev.map((u) => (u.id === selected.id ? { ...u, ...patch } : u)));
  }

  function toggleStatus(u: AppUser) {
    setUsers((prev) =>
      prev.map((x) =>
        x.id === u.id ? { ...x, status: x.status === "active" ? "suspended" : "active" } : x
      )
    );
  }

  function resetPassword(u: AppUser) {
    alert(`Reset password for ${u.name}`);
  }

  function deleteUser(u: AppUser) {
    if (confirm(`Delete user ${u.name}?`)) setUsers((prev) => prev.filter((x) => x.id !== u.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-semibold">App Users</div>
          <div className="text-sm text-muted-foreground">Manage your B2C user base</div>
        </div>

        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{filtered.length}</span> users
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full">
          <div className="w-full max-w-[520px]">
            <Input
              placeholder="Search by name or email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button variant="outline" className="rounded-xl">
            Filter
          </Button>
        </div>

        <Button className="rounded-xl bg-orange-600 hover:bg-orange-600">+ Add User</Button>
      </div>

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
            {filtered.map((u) => {
              const initials = u.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("");

              return (
                <TableRow key={u.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
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
                    {u.subscriptionExpires ? (
                      <div className="text-xs text-muted-foreground">Expires: {u.subscriptionExpires}</div>
                    ) : null}
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

                        <DropdownMenuItem onClick={() => openEdit(u)} className="gap-2">
                          <Pencil className="h-4 w-4" /> Edit User
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => toggleStatus(u)} className="gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          {u.status === "active" ? "Suspend User" : "Activate User"}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => resetPassword(u)} className="gap-2">
                          <RefreshCcw className="h-4 w-4" /> Reset Password
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => deleteUser(u)}
                          className="gap-2 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" /> Delete User
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
          </TableBody>
        </Table>
      </div>

      <UserDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={selected}
        onEdit={() => {
          setDetailsOpen(false);
          setEditOpen(true);
        }}
        onResetPassword={() => selected && resetPassword(selected)}
        onToggleStatus={() => selected && toggleStatus(selected)}
        onActivityLogs={() => alert("Open activity logs page/modal")}
      />

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selected}
        onSave={saveEdit}
      />
    </div>
  );
}
