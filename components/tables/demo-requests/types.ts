export type DemoStatus = "new" | "contacted" | "scheduled" | "completed" | "rejected";

export type DemoRequest = {
  id: string;

  agencyName: string;
  agencyType: string;
  website?: string;

  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;

  country: string;
  city: string;

  status: DemoStatus;
  assignedTo?: string; // name or "Unassigned"
  date: string; // "10/02/2026"

  requestNotes?: string;

  adminNotes?: string;
  followUpDate?: string; // "12/02/2026"
};
