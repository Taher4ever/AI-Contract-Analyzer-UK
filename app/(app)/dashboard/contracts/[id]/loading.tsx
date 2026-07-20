import { Skeleton } from "@/components/ui/skeleton";

export default function ContractLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <Skeleton className="mt-3 h-4 w-40" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[55%_45%]">
        <div className="space-y-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-[32rem] rounded-2xl" />
      </div>
    </div>
  );
}
