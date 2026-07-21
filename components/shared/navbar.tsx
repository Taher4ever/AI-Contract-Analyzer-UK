"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

export type NavbarUser = { email: string; avatarUrl?: string | null } | null;

// Fetched client-side (not passed down from a server layout) so marketing
// pages carry no cookies()/dynamic-API dependency and can be statically
// generated — the tradeoff is a brief "logged out" flash on first paint for
// already-signed-in visitors, which is standard for static marketing shells.
function useAuthUser(): NavbarUser {
  const [user, setUser] = useState<NavbarUser>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      setUser(u ? { email: u.email ?? "", avatarUrl: u.user_metadata?.avatar_url } : null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? { email: u.email ?? "", avatarUrl: u.user_metadata?.avatar_url } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}

export function Navbar() {
  const user = useAuthUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 motion-reduce:transition-none",
        scrolled ? "glass shadow-soft" : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-full px-3.5 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden md:block">
              <UserMenu email={user.email} avatarUrl={user.avatarUrl} />
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden rounded-full md:inline-flex"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Sign in
              </Button>
              <Button
                className="shadow-soft hidden rounded-full md:inline-flex"
                nativeButton={false}
                render={<Link href="/signup" />}
              >
                Analyze Contract
              </Button>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:bg-accent/60 rounded-xl px-3 py-2.5 text-base font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Separator className="my-3" />
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setMobileOpen(false)}
                      nativeButton={false}
                      render={<Link href="/dashboard" />}
                    >
                      Dashboard
                    </Button>
                    <SignOutButton
                      onClick={() => setMobileOpen(false)}
                      className="text-muted-foreground hover:text-foreground mt-2 rounded-xl px-3 py-2.5 text-left text-base font-medium transition-colors"
                    >
                      Sign out
                    </SignOutButton>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setMobileOpen(false)}
                      nativeButton={false}
                      render={<Link href="/login" />}
                    >
                      Sign in
                    </Button>
                    <Button
                      className="mt-2 rounded-full"
                      onClick={() => setMobileOpen(false)}
                      nativeButton={false}
                      render={<Link href="/signup" />}
                    >
                      Analyze Contract
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
