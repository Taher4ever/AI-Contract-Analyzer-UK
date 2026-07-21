import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog/posts";
import { formatBlogDate } from "@/lib/blog/format-date";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";
import { JsonLd } from "@/components/shared/json-ld";
import { Cta } from "@/components/marketing/cta";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      publishedTime: post.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: { "@type": "Organization", name: "ContractLens AI" },
    publisher: { "@type": "Organization", name: "ContractLens AI" },
    mainEntityOfPage: `${appUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <article className="py-16 lg:py-20">
        <Container className="max-w-3xl">
          <FadeIn>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
            >
              <ArrowLeft className="size-4" />
              Back to blog
            </Link>

            <h1 className="font-display mt-6 text-4xl tracking-tight text-balance sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-muted-foreground mt-4 text-sm">
              {formatBlogDate(post.createdAt)} · {post.readingMinutes} min read
            </p>

            {post.coverImage && (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </FadeIn>
        </Container>
      </article>

      <Cta />
    </>
  );
}
