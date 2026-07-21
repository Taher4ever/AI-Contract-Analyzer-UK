import type { Metadata } from "next";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";

export const metadata: Metadata = { title: "New Blog Post" };

export default function NewBlogPostPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">New post</h1>
      <div className="mt-6">
        <BlogEditorForm
          post={{
            id: null,
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            coverImage: "",
            published: false,
          }}
        />
      </div>
    </div>
  );
}
