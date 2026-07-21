import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlogLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-6 h-96 rounded-2xl" />
    </div>
  );
}
