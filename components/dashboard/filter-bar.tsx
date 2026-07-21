"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, Folder as FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUSES = [
  { value: "uploaded", label: "Uploaded" },
  { value: "processing", label: "Processing" },
  { value: "analyzed", label: "Analyzed" },
  { value: "failed", label: "Failed" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "risk", label: "Risk: high to low" },
];

export function FilterBar({
  folders,
}: {
  folders: { id: string; name: string }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const favoritesOnly = searchParams.get("favorites") === "1";
  const status = searchParams.get("status") ?? "";
  const folder = searchParams.get("folder") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  function buildHref(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={buildHref({ favorites: null })}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          !favoritesOnly
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border/60 hover:bg-muted"
        )}
      >
        All
      </Link>
      <Link
        href={buildHref({ favorites: favoritesOnly ? null : "1" })}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          favoritesOnly
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border/60 hover:bg-muted"
        )}
      >
        Favorites
      </Link>

      {folders.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="rounded-full" />}
          >
            <FolderIcon className="size-3.5" />
            {folder ? (folders.find((f) => f.id === folder)?.name ?? "Folder") : "All folders"}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem render={<Link href={buildHref({ folder: null })} />}>
              {!folder && <Check className="size-3.5" />}
              All folders
            </DropdownMenuItem>
            {folders.map((f) => (
              <DropdownMenuItem key={f.id} render={<Link href={buildHref({ folder: f.id })} />}>
                {folder === f.id && <Check className="size-3.5" />}
                {f.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" className="rounded-full" />}
        >
          {status ? (STATUSES.find((s) => s.value === status)?.label ?? "Status") : "All statuses"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem render={<Link href={buildHref({ status: null })} />}>
            {!status && <Check className="size-3.5" />}
            All statuses
          </DropdownMenuItem>
          {STATUSES.map((s) => (
            <DropdownMenuItem key={s.value} render={<Link href={buildHref({ status: s.value })} />}>
              {status === s.value && <Check className="size-3.5" />}
              {s.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" className="ml-auto rounded-full" />}
        >
          <ArrowUpDown className="size-3.5" />
          {SORTS.find((s) => s.value === sort)?.label}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SORTS.map((s) => (
            <DropdownMenuItem
              key={s.value}
              render={<Link href={buildHref({ sort: s.value === "newest" ? null : s.value })} />}
            >
              {sort === s.value && <Check className="size-3.5" />}
              {s.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
