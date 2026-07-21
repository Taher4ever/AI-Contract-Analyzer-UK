"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { blogPostSchema } from "@/lib/admin/blog-schema";

export type AdminActionResult = { success: true } | { success: false; error: string };

export async function saveBlogPost(
  postId: string | null,
  values: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    published: boolean;
  }
): Promise<AdminActionResult & { id?: string }> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };

  const parsed = blogPostSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const adminClient = createAdminClient();

  let existingQuery = adminClient.from("blog_posts").select("id").eq("slug", parsed.data.slug);
  if (postId) existingQuery = existingQuery.neq("id", postId);
  const { data: existing } = await existingQuery.maybeSingle();
  if (existing) return { success: false, error: "That slug is already in use." };

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
    cover_image: parsed.data.coverImage || null,
    published: parsed.data.published,
    author_id: admin.id,
  };

  if (postId) {
    const { error } = await adminClient.from("blog_posts").update(payload).eq("id", postId);
    if (error) return { success: false, error: "Could not save post." };
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${postId}`);
    return { success: true, id: postId };
  }

  const { data, error } = await adminClient
    .from("blog_posts")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { success: false, error: "Could not create post." };
  revalidatePath("/admin/blog");
  return { success: true, id: data.id };
}

export async function deleteBlogPost(postId: string): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };

  const adminClient = createAdminClient();
  const { data: post } = await adminClient
    .from("blog_posts")
    .select("cover_image")
    .eq("id", postId)
    .maybeSingle();

  const { error } = await adminClient.from("blog_posts").delete().eq("id", postId);
  if (error) return { success: false, error: "Could not delete post." };

  if (post?.cover_image) {
    const marker = "/object/public/blog/";
    const idx = post.cover_image.indexOf(marker);
    if (idx !== -1) {
      const path = decodeURIComponent(post.cover_image.slice(idx + marker.length).split("?")[0]);
      await adminClient.storage.from("blog").remove([path]);
    }
  }

  revalidatePath("/admin/blog");
  return { success: true };
}

const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadBlogCoverImage(
  formData: FormData
): Promise<AdminActionResult & { url?: string }> {
  const admin = await getAdminUser();
  if (!admin) return { success: false, error: "Not authorized." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please choose an image." };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Please upload an image file." };
  }
  if (file.size > 4 * 1024 * 1024) {
    return { success: false, error: "Image must be under 4MB." };
  }

  const ext = MIME_EXT[file.type] ?? "jpg";
  const path = `covers/${crypto.randomUUID()}.${ext}`;

  const adminClient = createAdminClient();
  const { error } = await adminClient.storage
    .from("blog")
    .upload(path, file, { contentType: file.type });
  if (error) return { success: false, error: "Could not upload image." };

  const {
    data: { publicUrl },
  } = adminClient.storage.from("blog").getPublicUrl(path);

  return { success: true, url: publicUrl };
}
