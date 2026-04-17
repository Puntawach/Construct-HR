import {
  getSitesAction,
  getMyAttendanceAction,
} from "@/lib/actions/employee/attendance.action";
import CheckInForm from "@/components/feature/employees/attendance/check-in-form";
import type { Attendance, Site } from "@/lib/types";
import { toDateKey, todayKey } from "@/lib/utils/date";

export default async function CheckInPage() {
  const [sitesResult, attendanceResult] = await Promise.all([
    getSitesAction(),
    getMyAttendanceAction(),
  ]);

  const sites: Site[] = sitesResult.success ? (sitesResult.data ?? []) : [];

  const key = todayKey();
  const todayAttendance: Attendance | null = attendanceResult.success
    ? ((attendanceResult.data ?? []).find(
        (a) => toDateKey(a.workDate) === key,
      ) ?? null)
    : null;

  return <CheckInForm sites={sites} todayAttendance={todayAttendance} />;
}
