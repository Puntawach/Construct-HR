import { Card, CardContent } from "@/components/ui/card";
import type { Attendance } from "@/lib/types";
import { CalendarDays, Clock } from "lucide-react";

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

const statusColor: Record<string, string> = {
  WORKING: "bg-blue-100 text-blue-700 border-blue-200",
  SUBMITTED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

type Props = {
  attendance: Attendance;
};

export default function AttendanceCard({ attendance }: Props) {
  const workDate = new Date(attendance.workDate);
  const checkIn = attendance.checkIns?.[0];
  const checkInTime = checkIn?.checkInTime
    ? new Date(checkIn.checkInTime).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "-";
  const checkOutTime = checkIn?.checkOutTime
    ? new Date(checkIn.checkOutTime).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "-";

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 rounded-lg p-2 shrink-0">
              <CalendarDays size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {workDate.toLocaleDateString("th-TH", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                <Clock size={11} />
                <span>
                  {checkInTime} – {checkOutTime}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[attendance.status]}`}
            >
              {statusLabel[attendance.status] ?? attendance.status}
            </span>
            {attendance.totalHours > 0 && (
              <span className="text-xs text-gray-400">
                {attendance.totalHours.toFixed(1)} ชม.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
