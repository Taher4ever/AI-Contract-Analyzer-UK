import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-72" />

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="mt-6 h-24 rounded-2xl" />
      <Skeleton className="mt-10 h-48 rounded-2xl" />
    </div>
  );
}
