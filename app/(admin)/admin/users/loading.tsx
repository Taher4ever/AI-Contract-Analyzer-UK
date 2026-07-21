import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-2 h-4 w-40" />
      <Skeleton className="mt-6 h-9 w-full max-w-sm rounded-lg" />
      <Skeleton className="mt-4 h-96 rounded-2xl" />
    </div>
  );
}
