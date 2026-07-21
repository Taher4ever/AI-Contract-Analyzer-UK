import {
  CreditCard,
  FileText,
  Folder,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresTeam?: boolean;
  requiresAdmin?: boolean;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
  { href: "/dashboard/folders", label: "Folders", icon: Folder },
  { href: "/dashboard/favorites", label: "Favorites", icon: Star },
  { href: "/dashboard/team", label: "Team", icon: Users, requiresTeam: true },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: ShieldCheck, requiresAdmin: true },
];
