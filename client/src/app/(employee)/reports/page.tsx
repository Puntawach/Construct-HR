import { getMyReportsAction } from "@/lib/actions/employee/report.action";
import { getMyAttendanceAction } from "@/lib/actions/employee/attendance.action";
import ReportForm from "@/components/feature/employees/reports/report-form";
import ReportList from "@/components/feature/employees/reports/report-list";
import type { Attendance } from "@/lib/types";

export default async function PageReportsEmployee() {
  const [reportsResult, attendanceResult] = await Promise.all([
    getMyReportsAction(),
    getMyAttendanceAction(),
  ]);

  const reports = reportsResult.success ? (reportsResult.data ?? []) : [];

  const submittedAttendances: Attendance[] = attendanceResult.success
    ? (attendanceResult.data ?? []).filter(
        (a) => a.status === "SUBMITTED" || a.status === "APPROVED",
      )
    : [];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-lg font-bold text-gray-800">รายงาน</h1>
        <p className="text-xs text-muted-foreground">รูปภาพและรายงานการทำงาน</p>
      </div>

      {submittedAttendances.length > 0 && (
        <ReportForm attendances={submittedAttendances} />
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600">รายงานทั้งหมด</h2>
          <span className="text-xs text-muted-foreground">
            {reports.length} รายการ
          </span>
        </div>
        <ReportList reports={reports} />
      </div>
    </div>
  );
}
