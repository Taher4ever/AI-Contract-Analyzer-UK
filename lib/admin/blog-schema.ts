import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  excerpt: z.string().max(500),
  content: z.string().max(50000),
  coverImage: z.string().max(2000),
  published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
