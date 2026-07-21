import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDocumentLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-40" />
      <Skeleton className="mt-6 h-96 rounded-2xl" />
    </div>
  );
}
