// app/admin/attendance/page.tsx
import { getCurrentUser } from "@/lib/auth/session";
import { teamService } from "@/lib/api/admin/team.service";
import AttendanceTable from "@/components/feature/admin/attendance/attendance-table";
import { attendanceService } from "@/lib/api/attendance/attendance.service";

export default async function AttendancePage() {
  await getCurrentUser();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [attendances, teams] = await Promise.all([
    attendanceService.getAllByMonth(month, year),
    teamService.getAll(),
  ]);

  return (
    <AttendanceTable
      initialAttendances={attendances}
      teams={teams}
      initialMonth={month}
      initialYear={year}
    />
  );
}
