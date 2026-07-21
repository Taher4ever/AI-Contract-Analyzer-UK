import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];
