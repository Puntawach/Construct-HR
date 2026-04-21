import { teamService } from "@/lib/api/admin/team.service"
import AttendanceTable from "@/components/feature/admin/attendance/attendance-table"
import { getAttendanceByMonthAction } from "@/lib/actions/admin/attendance.action"

type Props = {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function AttendancePage({ searchParams }: Props) {
  const params = await searchParams
  const now = new Date()
  const month = params.month ? Number(params.month) : now.getMonth() + 1
  const year = params.year ? Number(params.year) : now.getFullYear()

  const [attendancesResult, teams] = await Promise.all([
    getAttendanceByMonthAction(month, year),
    teamService.getAll(),
  ])

  const attendances = attendancesResult.success ? (attendancesResult.data ?? []) : []

  return (
    <AttendanceTable
      initialAttendances={attendances}
      teams={teams}
      initialMonth={month}
      initialYear={year}
    />
  )
}