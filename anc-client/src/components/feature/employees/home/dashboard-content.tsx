"use client";

import { Employee, Attendance } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import DashboardActions from "./dashboard-action";
import DashboardCardStatus from "./dashboard-cardStatus";
import DashboardHeader from "./dashboard-header";
import DashboardUpdate from "./dashboard-update";
import DashboardPayroll from "./dashboard-payroll";
import type { PayrollItem } from "@/lib/api/payroll/payroll-type";

const statusStyle: Record<string, string> = {
  WORKING: "bg-blue-100 text-blue-700",
  SUBMITTED: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

type Props = {
  employee: Employee;
  todayAttendance: Attendance | null;
  recentAttendances: Attendance[];
  payroll: PayrollItem | null;
};

export default function DashboardContent({
  employee,
  todayAttendance,
  recentAttendances,
  payroll,
}: Props) {
  const now = new Date();

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <DashboardHeader employee={employee} />
      <DashboardCardStatus todayAttendance={todayAttendance} />
      <DashboardActions todayAttendance={todayAttendance} />
      <DashboardUpdate todayAttendance={todayAttendance} />

      {/* Payroll */}
      <DashboardPayroll
        payroll={payroll}
        month={now.getMonth() + 1}
        year={now.getFullYear()}
      />

      {/* Recent Attendance */}
      <div className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            ประวัติล่าสุด
          </h2>
          <Link
            href="/attendance"
            className="text-xs text-blue-600 font-medium flex items-center gap-0.5"
          >
            ดูทั้งหมด <ChevronRight size={12} />
          </Link>
        </div>

        {recentAttendances.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            ยังไม่มีประวัติการทำงาน
          </div>
        ) : (
          <div className="space-y-2">
            {recentAttendances.map((att) => {
              const checkIn = att.checkIns?.[0];
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
                <div
                  key={att.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(att.workDate).toLocaleDateString("th-TH", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={10} />
                        <span>
                          {checkInTime} – {checkOutTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {att.totalHours > 0 && (
                      <p className="text-sm font-semibold text-gray-800">
                        {att.totalHours.toFixed(1)}ชม.
                      </p>
                    )}
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        statusStyle[att.status],
                      )}
                    >
                      {statusLabel[att.status] ?? att.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
