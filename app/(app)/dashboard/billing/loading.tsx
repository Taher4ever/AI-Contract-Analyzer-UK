import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-3 h-4 w-64" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <Skeleton className="mt-10 h-6 w-24" />
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
