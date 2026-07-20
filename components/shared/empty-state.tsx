import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-2xl">
        <Icon className="text-muted-foreground size-6" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button
          className="mt-5 rounded-full"
          nativeButton={false}
          render={<Link href={actionHref} />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
