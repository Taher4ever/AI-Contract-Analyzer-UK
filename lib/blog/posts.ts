import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { readingTime } from "@/lib/blog/reading-time";

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: string;
  readingMinutes: number;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

// Blog posts are fully public once published (enforced by RLS), and these
// reads happen from generateStaticParams/sitemap as well as request-time
// pages — a plain anon client avoids relying on cookies()/request scope,
// which generateStaticParams and sitemap() run outside of.
function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, cover_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.cover_image,
    createdAt: p.created_at,
    readingMinutes: readingTime(p.content ?? ""),
  }));
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, cover_image, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    coverImage: data.cover_image,
    createdAt: data.created_at,
    readingMinutes: readingTime(data.content ?? ""),
    content: data.content ?? "",
  };
}
