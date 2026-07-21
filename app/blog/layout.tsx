import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/server";

// Deliberately outside the (marketing) route group: (marketing)/loading.tsx
// wraps every page beneath it in a Suspense boundary, which forces Next.js
// to flush a 200 status before a nested page's notFound() call can run —
// blog posts need a real 404 for unpublished/unknown slugs, so this layout
// duplicates the marketing chrome without inheriting that loading boundary.
export default async function BlogLayout({
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
