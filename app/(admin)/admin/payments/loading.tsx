import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPaymentsLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-2 h-4 w-40" />
      <Skeleton className="mt-6 h-24 w-full max-w-xs rounded-2xl" />
      <Skeleton className="mt-6 h-96 rounded-2xl" />
    </div>
  );
}
