"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Newspaper, Pencil, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBlogPost } from "@/app/(admin)/admin/blog/actions";

export interface AdminBlogPostRow {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

function DeletePostButton({ post }: { post: AdminBlogPostRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteBlogPost(post.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="destructive" size="icon-sm" aria-label={`Delete ${post.title}`} />}
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this post?</DialogTitle>
          <DialogDescription>
            This permanently deletes &quot;{post.title}&quot;. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={onDelete}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BlogPostsTable({
  posts,
  emptyTitle,
  emptyDescription,
}: {
  posts: AdminBlogPostRow[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const columns: DataTableColumn<AdminBlogPostRow>[] = [
    {
      key: "title",
      header: "Title",
      render: (p) => (
        <Link href={`/admin/blog/${p.id}`} className="font-medium hover:underline">
          {p.title}
        </Link>
      ),
    },
    { key: "slug", header: "Slug", render: (p) => <span className="text-muted-foreground">/{p.slug}</span> },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={p.published ? "default" : "secondary"}>
          {p.published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (p) =>
        new Date(p.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Edit ${p.title}`}
            nativeButton={false}
            render={<Link href={`/admin/blog/${p.id}`} />}
          >
            <Pencil className="size-4" />
          </Button>
          <DeletePostButton post={p} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={posts}
      emptyIcon={Newspaper}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  );
}
