import { Skeleton } from "@/components/ui/skeleton";

export function AttendanceRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

export function AttendanceHistorySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {[1, 2, 3, 4, 5].map((i) => (
          <AttendanceRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function TodayCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <Skeleton className="h-4 w-40 mx-auto" />
      <Skeleton className="h-12 w-48 mx-auto" />
      <Skeleton className="w-36 h-36 rounded-full mx-auto" />
    </div>
  );
}

export function ReportCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white">
      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full shrink-0" />
    </div>
  );
}

export function ReportListSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {[1, 2, 3, 4, 5].map((i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PayrollCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b pb-3"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="border-b border-white/10 p-4">
        <Skeleton className="h-9 w-64 bg-white/10" />
      </div>
      <div className="divide-y divide-white/5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40 bg-white/10" />
              <Skeleton className="h-3 w-28 bg-white/10" />
            </div>
            <Skeleton className="h-4 w-16 bg-white/10" />
            <Skeleton className="h-4 w-16 bg-white/10" />
            <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-white/10" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl bg-white/10" />
        <Skeleton className="h-64 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

export function AdminPayrollSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-white/10" />
        <Skeleton className="h-9 w-32 rounded-lg bg-white/10" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl bg-white/10" />
      <Skeleton className="h-14 w-full rounded-xl bg-white/10" />
      <AdminTableSkeleton />
    </div>
  );
}
