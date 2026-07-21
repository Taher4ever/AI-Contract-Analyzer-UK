"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { saveBlogPost, uploadBlogCoverImage } from "@/app/(admin)/admin/blog/actions";
import { slugify } from "@/lib/admin/blog-schema";

export interface BlogPostFormValues {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
}

export function BlogEditorForm({ post }: { post: BlogPostFormValues }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(post.id));
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);
  const [coverImage, setCoverImage] = useState(post.coverImage);
  const [published, setPublished] = useState(post.published);

  const [isSaving, startSaveTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const onUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    startUploadTransition(async () => {
      const result = await uploadBlogCoverImage(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setCoverImage(result.url!);
    });
  };

  const onSave = () => {
    startSaveTransition(async () => {
      const result = await saveBlogPost(post.id, {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(post.id ? "Post saved." : "Post created.");
      if (!post.id && result.id) {
        router.push(`/admin/blog/${result.id}`);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass shadow-soft grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            className="mt-1.5"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            className="mt-1.5"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="flex items-end">
          <Label htmlFor="published" className="flex items-center gap-2">
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
            Published
          </Label>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            className="mt-1.5"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Cover image</Label>
          <div className="mt-1.5 flex items-center gap-3">
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="" className="h-16 w-28 rounded-lg object-cover" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {coverImage ? "Replace image" : "Upload image"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass shadow-soft rounded-2xl p-6">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            className="mt-1.5 min-h-[420px] font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="glass shadow-soft rounded-2xl p-6">
          <p className="text-muted-foreground text-sm font-medium">Preview</p>
          <div className="mt-3">
            {content.trim() ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-3 text-2xl font-semibold">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-6 mb-2 text-xl font-semibold">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-sm leading-relaxed last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-3 list-disc space-y-1 pl-5 text-sm">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm">{children}</ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-primary/40 text-muted-foreground border-l-2 pl-4 text-sm italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground text-sm">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="rounded-full"
          disabled={isSaving || !title.trim() || !slug.trim()}
          onClick={onSave}
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          <Save className="size-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
