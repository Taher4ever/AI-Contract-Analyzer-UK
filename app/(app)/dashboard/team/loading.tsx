import { Skeleton } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-3 h-4 w-64" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <Skeleton className="mt-8 h-6 w-40" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
