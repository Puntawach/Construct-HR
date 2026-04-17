import { getMyAttendanceAction } from "@/lib/actions/employee/attendance.action";
import CheckOutForm from "@/components/feature/employees/attendance/check-out-form";
import type { Attendance } from "@/lib/types";
import { redirect } from "next/navigation";
import { toDateKey, todayKey } from "@/lib/utils/date";

export default async function CheckOutPage() {
  const result = await getMyAttendanceAction();

  const key = todayKey();
  const todayAttendance: Attendance | null = result.success
    ? ((result.data ?? []).find((a) => toDateKey(a.workDate) === key) ?? null)
    : null;

  if (!todayAttendance || todayAttendance.status !== "WORKING") {
    redirect("/attendance");
  }

  return <CheckOutForm attendance={todayAttendance} />;
}
