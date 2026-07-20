"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { navItems } from "@/components/dashboard/nav-items";
import { signOut } from "@/app/(auth)/actions";

export function Topbar({
  email,
  fullName,
  avatarUrl,
  onOpenMobileMenu,
}: {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  onOpenMobileMenu: () => void;
}) {
  const pathname = usePathname();
  const title = navItems.find((item) => item.href === pathname)?.label ?? "Dashboard";
  const initials = (fullName || email || "?").slice(0, 2).toUpperCase();

  return (
    <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full md:hidden"
        onClick={onOpenMobileMenu}
      >
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            disabled
            placeholder="Search contracts…"
            className="w-56 rounded-full pl-9"
          />
        </div>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-3"
              />
            }
          >
            <Avatar>
              {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="max-w-48 truncate px-1.5 py-1 text-sm font-medium">
              {fullName || email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
