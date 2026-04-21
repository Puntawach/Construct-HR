'use client'

import { useState, useMemo } from "react"
import { Clock, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Attendance, AttendanceStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
}

const statusColor: Record<string, string> = {
  WORKING: "bg-blue-50 text-blue-600",
  SUBMITTED: "bg-amber-50 text-amber-600",
  APPROVED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-600",
}

const PAGE_SIZE = 8
type StatusFilter = AttendanceStatus | "ALL"

type Props = {
  attendances: Attendance[]
}

export default function AttendanceHistory({ attendances }: Props) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [page, setPage] = useState(1)

  const monthLabel = new Date(year, month, 1).toLocaleDateString("th-TH", {
    month: "long", year: "numeric",
  })

  function prevMonth() {
    setPage(1)
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    setPage(1)
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const filtered = useMemo(() => {
    return attendances.filter((a) => {
      const local = new Date(new Date(a.workDate).getTime() + 7 * 60 * 60 * 1000)
      const matchMonth = local.getUTCMonth() === month && local.getUTCFullYear() === year
      const matchStatus = statusFilter === "ALL" || a.status === statusFilter
      return matchMonth && matchStatus
    })
  }, [attendances, month, year, statusFilter])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "ทั้งหมด", value: "ALL" },
    { label: "ทำงาน", value: "WORKING" },
    { label: "รอตรวจ", value: "SUBMITTED" },
    { label: "อนุมัติ", value: "APPROVED" },
    { label: "ไม่อนุมัติ", value: "REJECTED" },
  ]

  return (
    <div className="space-y-3">
      {/* Month navigator */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm shadow-black/5">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        <p className="text-sm font-semibold text-gray-800">{monthLabel}</p>
        <button
          onClick={nextMonth}
          disabled={month === now.getMonth() && year === now.getFullYear()}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map((f) => {
          const count = f.value !== "ALL"
            ? attendances.filter((a) => {
                const local = new Date(new Date(a.workDate).getTime() + 7 * 60 * 60 * 1000)
                return local.getUTCMonth() === month && local.getUTCFullYear() === year && a.status === f.value
              }).length
            : null

          return (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1) }}
              className={cn(
                "shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all",
                statusFilter === f.value
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              )}
            >
              {f.label}
              {count !== null && (
                <span className="ml-1 opacity-60">({count})</span>
              )}
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400 bg-white rounded-2xl border border-gray-100">
          ไม่มีข้อมูลในช่วงเวลานี้
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 overflow-hidden divide-y divide-gray-50">
            {visible.map((att) => {
              const checkIn = att.checkIns?.[0]
              const checkInTime = checkIn?.checkInTime
                ? new Date(checkIn.checkInTime).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })
                : "-"
              const checkOutTime = checkIn?.checkOutTime
                ? new Date(checkIn.checkOutTime).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })
                : "-"

              return (
                <div key={att.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-gray-500">
                        {new Date(att.workDate).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(att.workDate).toLocaleDateString("th-TH", {
                          weekday: "short", month: "short",
                        })}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                        <Clock size={10} />
                        <span>{checkInTime} – {checkOutTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn(
                      "text-[11px] px-2.5 py-0.5 rounded-full font-semibold",
                      statusColor[att.status]
                    )}>
                      {statusLabel[att.status]}
                    </span>
                    {att.totalHours > 0 && (
                      <span className="text-xs text-gray-400">
                        {att.totalHours.toFixed(1)} ชม.
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {hasMore && (
            <button
              className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 bg-white rounded-2xl border border-gray-100"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronDown size={14} />
              โหลดเพิ่ม ({filtered.length - visible.length} รายการ)
            </button>
          )}
        </>
      )}
    </div>
  )
}