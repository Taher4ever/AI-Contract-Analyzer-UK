import {
  CreditCard,
  FileText,
  Folder,
  LayoutDashboard,
  Settings,
  Star,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
  { href: "/dashboard/folders", label: "Folders", icon: Folder },
  { href: "/dashboard/favorites", label: "Favorites", icon: Star },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
