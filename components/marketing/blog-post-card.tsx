import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import type { BlogPostSummary } from "@/lib/blog/posts";
import { formatBlogDate } from "@/lib/blog/format-date";

function CoverImage({
  post,
  sizes,
  priority,
}: {
  post: BlogPostSummary;
  sizes: string;
  priority?: boolean;
}) {
  if (post.coverImage) {
    return (
      <Image
        src={post.coverImage}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }
  return (
    <div className="bg-primary/10 flex size-full items-center justify-center">
      <Newspaper className="text-primary/40 size-10" />
    </div>
  );
}

export function BlogFeaturedPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass shadow-soft-lg group grid overflow-hidden rounded-3xl transition-transform lg:grid-cols-2"
    >
      <div className="relative aspect-video overflow-hidden lg:aspect-auto">
        <CoverImage post={post} sizes="(min-width: 1024px) 50vw, 100vw" priority />
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Latest article
        </p>
        <h2 className="font-display mt-3 text-3xl tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">{post.excerpt}</p>
        )}
        <p className="text-muted-foreground mt-6 text-sm">
          {formatBlogDate(post.createdAt)} · {post.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}

export function BlogPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass shadow-soft hover:shadow-soft-lg group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-video overflow-hidden">
        <CoverImage post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-semibold group-hover:underline">{post.title}</h3>
        {post.excerpt && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <p className="text-muted-foreground mt-auto pt-4 text-xs">
          {formatBlogDate(post.createdAt)} · {post.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}
