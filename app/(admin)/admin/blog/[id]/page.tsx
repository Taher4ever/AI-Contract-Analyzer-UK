import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";

export const metadata: Metadata = { title: "Edit Blog Post" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: post } = await admin
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, cover_image, published")
    .eq("id", id)
    .maybeSingle();
  if (!post) notFound();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <div className="mt-6">
        <BlogEditorForm
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content ?? "",
            coverImage: post.cover_image ?? "",
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
