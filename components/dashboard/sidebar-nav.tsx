"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/components/dashboard/nav-items";
import { cn } from "@/lib/utils";

export function SidebarNav({
  scope,
  collapsed = false,
  onNavigate,
}: {
  scope: "desktop" | "mobile";
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
              collapsed && "justify-center px-2"
            )}
          >
            {active && (
              <motion.span
                layoutId={`sidebar-active-${scope}`}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="bg-primary absolute inset-0 -z-10 rounded-xl"
              />
            )}
            <item.icon className="size-4.5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
