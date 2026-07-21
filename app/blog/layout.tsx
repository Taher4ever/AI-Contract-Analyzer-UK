import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

// Deliberately outside the (marketing) route group: (marketing)/loading.tsx
// wraps every page beneath it in a Suspense boundary, which forces Next.js
// to flush a 200 status before a nested page's notFound() call can run —
// blog posts need a real 404 for unpublished/unknown slugs, so this layout
// duplicates the marketing chrome without inheriting that loading boundary.
// Navbar fetches its own auth state client-side, so this layout has no
// cookies()/dynamic-API dependency and the blog index + posts stay static.
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-grain flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
