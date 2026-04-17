import { getMyAttendanceAction } from "@/lib/actions/employee/attendance.action";
import AttendanceCalendar from "@/components/feature/employees/calendar/attendance-calendar";
import type { Attendance } from "@/lib/types";

export default async function CalendarPage() {
  const result = await getMyAttendanceAction();
  const attendances: Attendance[] = result.success ? (result.data ?? []) : [];

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="text-lg font-bold text-gray-800">ปฏิทินการทำงาน</h1>
        <p className="text-xs text-muted-foreground">
          ประวัติการเข้างานรายเดือน
        </p>
      </div>
      <AttendanceCalendar attendances={attendances} />
    </div>
  );
}
