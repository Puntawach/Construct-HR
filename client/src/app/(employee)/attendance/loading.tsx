import {
  TodayCardSkeleton,
  AttendanceHistorySkeleton,
} from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-1">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
      </div>
      <TodayCardSkeleton />
      <AttendanceHistorySkeleton />
    </div>
  );
}
