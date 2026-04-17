import { AdminDashboardSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </div>
      <AdminDashboardSkeleton />
    </div>
  );
}
