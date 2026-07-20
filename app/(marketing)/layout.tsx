import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-grain flex min-h-dvh flex-col">
      <Navbar
        user={user ? { email: user.email ?? "", avatarUrl: user.user_metadata?.avatar_url } : null}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
