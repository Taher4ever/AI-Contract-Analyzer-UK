"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo, LogoMark } from "@/components/shared/logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { SidebarFooter } from "@/components/dashboard/sidebar-footer";
import { Topbar } from "@/components/dashboard/topbar";
import type { Plan, UserRole } from "@/types/database";
import { cn } from "@/lib/utils";

export function DashboardShell({
  children,
  email,
  fullName,
  avatarUrl,
  plan,
  role,
}: {
  children: React.ReactNode;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  plan: Plan;
  role?: UserRole;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-grain flex min-h-dvh">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r px-3 py-5 transition-all duration-300 md:flex",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center px-1",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          {collapsed ? <LogoMark /> : <Logo />}
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          <SidebarNav scope="desktop" collapsed={collapsed} plan={plan} role={role} />
        </div>
        <SidebarFooter
          plan={plan}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <SidebarNav
              scope="mobile"
              onNavigate={() => setMobileOpen(false)}
              plan={plan}
              role={role}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-h-dvh flex-1 flex-col">
        <Topbar
          email={email}
          fullName={fullName}
          avatarUrl={avatarUrl}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
