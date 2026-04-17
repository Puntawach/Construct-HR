import { ReportListSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="space-y-6 pb-8">
      <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
      <ReportListSkeleton />
    </div>
  );
}
