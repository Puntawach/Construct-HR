import { AdminPayrollSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
      </div>
      <AdminPayrollSkeleton />
    </div>
  );
}
