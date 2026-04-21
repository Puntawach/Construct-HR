import { getMyReportsAction } from "@/lib/actions/employee/report.action"
import { getMyAttendanceAction } from "@/lib/actions/employee/attendance.action"
import ReportList from "@/components/feature/employees/reports/report-list"
import type { Attendance } from "@/lib/types"
import type { ReportWithAttendance } from "@/lib/api/report/report.type"

export default async function PageReportsEmployee() {
  const [reportsResult, attendanceResult] = await Promise.all([
    getMyReportsAction(),
    getMyAttendanceAction(),
  ])

  const reports: ReportWithAttendance[] = reportsResult.success ? (reportsResult.data ?? []) : []

  const submittedAttendances: Attendance[] = attendanceResult.success
    ? (attendanceResult.data ?? []).filter(
        (a) => a.status === "SUBMITTED" || a.status === "APPROVED",
      )
    : []

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">รายงาน</h1>
        <p className="text-sm text-gray-400 mt-0.5">รูปภาพและรายงานการทำงาน</p>
      </div>
      <ReportList reports={reports} attendances={submittedAttendances} />
    </div>
  )
}