"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, ShieldBan, Loader2, Globe, MapPin, CalendarDays } from "lucide-react";
import type { Agency } from "./types";
import { StatusBadge, SubscriptionBadge, VerificationBadge } from "./badges";

import { useAgencyDetailsQuery, useToggleAgencySuspendMutation } from "@/src/queries/agencies.queries";
import { toastSuccess, toastError } from "@/lib/toast";

function money(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatDate(date?: string | null) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function formatBytes(bytes?: number) {
  if (!bytes || Number.isNaN(bytes)) return "-";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes} B`;
}

export function AgencyDetailsDialog({
  open,
  onOpenChange,
  agency,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agency: Agency | null;
}) {
  const agencyId = agency?.id || null;

  const detailsQ = useAgencyDetailsQuery(agencyId, open);
  const toggleM = useToggleAgencySuspendMutation();

  // ✅ FIXED PATH
  const d = detailsQ.data?.data;

  if (!agency) return null;

  const initials = (d?.agencyName || agency.name || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join("");

  const isSuspended = Boolean(d?.isSuspended) || agency.status === "suspended";

  async function onToggleSuspend() {
    if (!agencyId) return;

    try {
      await toggleM.mutateAsync({
        agencyId,
        suspended: !isSuspended,
      });

      toastSuccess(!isSuspended ? "Agency suspended" : "Agency unsuspended");
    } catch (e: any) {
      toastError(e?.message || "Failed to update agency status");
    }
  }

  function onViewDocs(url?: string) {
    if (!url) {
      toastError("No document found");
      return;
    }
    window.open(url, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] rounded-2xl p-0 overflow-hidden">
        <div className="max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base font-semibold">Agency Details</DialogTitle>
          </DialogHeader>

          <div className="mt-5 flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                {initials || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="font-semibold">{d?.agencyName || agency.name}</div>
              <div className="text-sm text-muted-foreground">{d?.businessType || agency.type}</div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <VerificationBadge value={agency.verification} />
                <StatusBadge value={isSuspended ? "suspended" : (d?.status || agency.status)} />
                <SubscriptionBadge value={agency.subscription} />
              </div>
            </div>
          </div>

          {detailsQ.isLoading ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading full agency details...
            </div>
          ) : detailsQ.isError ? (
            <div className="mt-6 rounded-xl border p-3 text-sm text-red-600 bg-red-50">
              {(detailsQ.error as any)?.message || "Failed to load agency details"}
            </div>
          ) : (
            <>
              {/* Agency Info */}
              <div className="mt-6">
                <div className="text-sm font-semibold mb-3">Agency Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Agency Name</div>
                    <div className="font-medium">{d?.agencyName || agency.name}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Business Type</div>
                    <div className="font-medium">{d?.businessType || agency.type || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Registration Number</div>
                    <div className="font-medium">{d?.registrationNumber || agency.registrationNumber || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Status</div>
                    <div className="font-medium capitalize">{d?.status || agency.status || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Website</div>
                    <div className="font-medium break-all">
                      {d?.website ? (
                        <a
                          href={d.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {d.website}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Registered Address</div>
                    <div className="font-medium">{d?.registeredAddress || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Joined At</div>
                    <div className="font-medium">{formatDate(d?.joinedAt)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Suspended</div>
                    <div className="font-medium">
                      {d?.isSuspended ? `Yes${d?.suspendedAt ? ` (${formatDate(d.suspendedAt)})` : ""}` : "No"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Owner Info */}
              <div>
                <div className="text-sm font-semibold mb-3">Owner Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Owner Name</div>
                    <div className="font-medium">{d?.owner?.fullName || agency.adminName || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Email</div>
                    <div className="font-medium">{d?.owner?.email || agency.email || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Contact</div>
                    <div className="font-medium">{d?.owner?.contact || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Phone (E164)</div>
                    <div className="font-medium">{d?.owner?.phoneE164 || agency.phone || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Country Code</div>
                    <div className="font-medium">{d?.owner?.countryCode || "-"}</div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Subscription */}
              <div>
                <div className="text-sm font-semibold mb-3">Subscription</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Plan Key</div>
                    <div className="font-medium">{d?.subscription?.planKey || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Subscription Status</div>
                    <div className="font-medium">{d?.subscription?.subStatus || "-"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">Start Date</div>
                    <div className="font-medium">{formatDate(d?.subscription?.startDate)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-muted-foreground">End Date</div>
                    <div className="font-medium">{formatDate(d?.subscription?.endDate)}</div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Metrics */}
              <div>
                <div className="text-sm font-semibold mb-3">Metrics</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Total Trips</div>
                    <div className="mt-1 text-lg font-semibold">
                      {d?.metrics?.totalTrips ?? agency.totalTrips}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Total Travelers</div>
                    <div className="mt-1 text-lg font-semibold">
                      {d?.metrics?.totalTravelers ?? 0}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Active Travelers</div>
                    <div className="mt-1 text-lg font-semibold">
                      {d?.metrics?.activeTravelers ?? agency.activeTravelers}
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Revenue Contribution</div>
                    <div className="mt-1 text-lg font-semibold">
                      {money(d?.metrics?.revenueContribution ?? agency.revenueContribution)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Documents */}
              <div>
                <div className="text-sm font-semibold mb-3">Documents</div>

                {d?.documents?.length ? (
                  <div className="space-y-3">
                    {d.documents.map((doc: any) => (
                      <div
                        key={doc._id}
                        className="rounded-xl border p-4 flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words">{doc.fileName || "-"}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Type: {doc.fileType || "-"} • Size: {formatBytes(doc.fileSize)}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Uploaded: {formatDate(doc.createdAt)}
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          className="rounded-xl shrink-0"
                          onClick={() => onViewDocs(doc.storagePath)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No documents found.</div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Actions */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Quick Actions</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    className="rounded-xl gap-2"
                    onClick={() => onViewDocs(d?.documents?.[0]?.storagePath)}
                  >
                    <FileText className="h-4 w-4" />
                    View First Document
                  </Button>

                  <Button
                    variant="secondary"
                    className="rounded-xl gap-2 bg-amber-50 hover:bg-amber-50 text-amber-700"
                    onClick={onToggleSuspend}
                    disabled={toggleM.isPending}
                  >
                    {toggleM.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldBan className="h-4 w-4" />
                    )}
                    {isSuspended ? "Unsuspend" : "Suspend"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}