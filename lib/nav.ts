// lib/nav.ts

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings,
  DollarSign,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: "main" | "bottom"; // optional grouping
};

export const adminNav: AdminNavItem[] = [
  // ===== MAIN =====
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "main" },
  { title: "App Users", href: "/app-users", icon: Users, section: "main" },
  { title: "Agencies", href: "/agencies", icon: Building2, section: "main" },
  { title: "Subscriptions", href: "/subscriptions", icon: CreditCard, section: "main" },
  { title: "Payments", href: "/payments", icon: DollarSign, section: "main" },
  { title: "Analytics", href: "/analytics", icon: BarChart3, section: "main" },

  // ===== BOTTOM =====
  { title: "Settings", href: "/settings", icon: Settings, section: "bottom" },
];
