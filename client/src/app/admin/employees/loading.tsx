import { AdminTableSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-white/10 rounded-lg animate-pulse" />
      </div>
      <AdminTableSkeleton />
    </div>
  );
}
