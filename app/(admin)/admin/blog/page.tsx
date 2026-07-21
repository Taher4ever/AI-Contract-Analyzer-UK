import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BlogPostsTable, type AdminBlogPostRow } from "@/components/admin/blog-posts-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Admin Blog" };

export default async function AdminBlogPage() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("blog_posts")
    .select("id, title, slug, published, created_at")
    .order("created_at", { ascending: false });

  const rows: AdminBlogPostRow[] = (posts ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    published: p.published,
    createdAt: p.created_at,
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog</h1>
          <p className="text-muted-foreground mt-1 text-sm">{rows.length} posts.</p>
        </div>
        <Button className="rounded-full" nativeButton={false} render={<Link href="/admin/blog/new" />}>
          <Plus className="size-4" />
          New post
        </Button>
      </div>

      <div className="mt-6">
        <BlogPostsTable
          posts={rows}
          emptyTitle="No posts yet"
          emptyDescription="Create your first blog post to get started."
        />
      </div>
    </div>
  );
}
