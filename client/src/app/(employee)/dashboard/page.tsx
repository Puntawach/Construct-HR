import DashboardContent from "@/components/feature/employees/home/dashboard-content";
import { getMyAttendanceAction } from "@/lib/actions/employee/attendance.action";
import { getMyPayrollAction } from "@/lib/actions/employee/payroll.action";
import { getMeAction } from "@/lib/actions/employee/employee-action";
import { toDateKey, todayKey } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [employeeResult, attendanceResult, payrollResult] = await Promise.all([
    getMeAction(),
    getMyAttendanceAction(),
    getMyPayrollAction(month, year),
  ]);

  if (!employeeResult.success || !employeeResult.data) redirect("/login");

  const attendances: Attendance[] = attendanceResult.success
    ? (attendanceResult.data ?? [])
    : [];

  const key = todayKey();
  const todayAttendance =
    attendances.find((a) => toDateKey(a.workDate) === key) ?? null;

  const recentAttendances = attendances
    .filter((a) => toDateKey(a.workDate) !== key)
    .sort(
      (a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime(),
    )
    .slice(0, 3);

  const payroll = payrollResult.success ? (payrollResult.data ?? null) : null;

  return (
    <DashboardContent
      employee={employeeResult.data}
      todayAttendance={todayAttendance}
      recentAttendances={recentAttendances}
      payroll={payroll}
    />
  );
}
