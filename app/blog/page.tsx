import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog/posts";
import { BlogFeaturedPostCard, BlogPostCard } from "@/components/marketing/blog-post-card";
import { Container } from "@/components/shared/container";
import { FadeIn, FadeInStagger } from "@/components/shared/motion";
import { EmptyState } from "@/components/shared/empty-state";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Plain-English guides to UK contracts — tenancy red flags, notice periods, auto-renewal clauses and more.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">Blog</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-balance sm:text-5xl">
            Plain-English guides to UK contracts
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            No legal dictionary required — just the things that actually matter before you sign.
          </p>
        </FadeIn>

        {!featured ? (
          <div className="glass shadow-soft mx-auto mt-14 max-w-lg rounded-2xl">
            <EmptyState
              icon={Newspaper}
              title="No posts yet"
              description="Check back soon for plain-English guides to UK contracts."
            />
          </div>
        ) : (
          <>
            <FadeIn className="mt-14">
              <BlogFeaturedPostCard post={featured} />
            </FadeIn>

            {rest.length > 0 && (
              <FadeInStagger faster className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <FadeIn key={post.id}>
                    <BlogPostCard post={post} />
                  </FadeIn>
                ))}
              </FadeInStagger>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
