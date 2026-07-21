"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { adminNavItems } from "@/components/admin/admin-nav-items";
import { signOut } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = adminNavItems.find((item) => item.href === pathname)?.label ?? "Admin";

  return (
    <div className="bg-grain flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r px-3 py-5 md:flex">
        <div className="flex items-center justify-between px-1">
          <Logo />
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
            Admin
          </span>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {adminNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}
              >
                <item.icon className="size-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-1 border-t pt-3">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent/60"
          >
            <ArrowLeft className="size-4.5 shrink-0" />
            Back to dashboard
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent/60"
          >
            <LogOut className="size-4.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 lg:px-8">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
