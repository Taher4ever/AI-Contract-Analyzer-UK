import { Skeleton } from "@/components/ui/skeleton";

export default function EditBlogPostLoading() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-6 h-64 rounded-2xl" />
      <Skeleton className="mt-6 h-96 rounded-2xl" />
    </div>
  );
}
