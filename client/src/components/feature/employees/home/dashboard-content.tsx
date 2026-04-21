'use client'

import { Employee, Attendance } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import DashboardActions from "./dashboard-action"
import DashboardCardStatus from "./dashboard-cardStatus"
import DashboardHeader from "./dashboard-header"
import DashboardUpdate from "./dashboard-update"
import DashboardPayroll from "./dashboard-payroll"
import type { PayrollItem } from "@/lib/api/payroll/payroll-type"

const statusStyle: Record<string, string> = {
  WORKING: "bg-blue-100 text-blue-600",
  SUBMITTED: "bg-amber-100 text-amber-600",
  APPROVED: "bg-green-100 text-green-600",
  REJECTED: "bg-red-100 text-red-600",
}

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
}

type Props = {
  employee: Employee
  todayAttendance: Attendance | null
  recentAttendances: Attendance[]
  payroll: PayrollItem | null
}

export default function DashboardContent({ employee, todayAttendance, recentAttendances, payroll }: Props) {
  const now = new Date()

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <DashboardHeader employee={employee} />
      <DashboardCardStatus todayAttendance={todayAttendance} />
      <DashboardActions todayAttendance={todayAttendance} />
      <DashboardUpdate todayAttendance={todayAttendance} />
      <DashboardPayroll payroll={payroll} month={now.getMonth() + 1} year={now.getFullYear()} />

      {/* Recent Attendance */}
      {recentAttendances.length > 0 && (
        <div className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              ประวัติล่าสุด
            </h2>
            <Link
              href="/attendance"
              className="text-xs text-blue-500 font-medium flex items-center gap-0.5"
            >
              ดูทั้งหมด <ChevronRight size={12} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 overflow-hidden divide-y divide-gray-50">
            {recentAttendances.map((att) => {
              const checkIn = att.checkIns?.[0]
              const checkInTime = checkIn?.checkInTime
                ? new Date(checkIn.checkInTime).toLocaleTimeString("th-TH", {
                    hour: "2-digit", minute: "2-digit", hour12: false,
                  })
                : "-"
              const checkOutTime = checkIn?.checkOutTime
                ? new Date(checkIn.checkOutTime).toLocaleTimeString("th-TH", {
                    hour: "2-digit", minute: "2-digit", hour12: false,
                  })
                : "-"

              return (
                <div key={att.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gray-500">
                        {new Date(att.workDate).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(att.workDate).toLocaleDateString("th-TH", {
                          weekday: "short", month: "short",
                        })}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock size={10} />
                        <span>{checkInTime} – {checkOutTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {att.totalHours > 0 && (
                      <p className="text-sm font-bold text-gray-700">
                        {att.totalHours.toFixed(1)}<span className="text-xs font-normal text-gray-400">h</span>
                      </p>
                    )}
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      statusStyle[att.status]
                    )}>
                      {statusLabel[att.status]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}