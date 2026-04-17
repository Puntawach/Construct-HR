import { CalendarSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return (
    <div className="space-y-4 pb-8">
      <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
      <CalendarSkeleton />
    </div>
  );
}
