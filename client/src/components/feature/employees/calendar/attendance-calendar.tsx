'use client'

import { useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react"
import type { Attendance } from "@/lib/types"
import { toDateKey } from "@/lib/utils/date"
import { cn } from "@/lib/utils"

const statusDot: Record<string, string> = {
  WORKING: "bg-blue-500",
  SUBMITTED: "bg-amber-400",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
}

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
}

const statusCardColor: Record<string, string> = {
  WORKING: "bg-blue-50",
  SUBMITTED: "bg-amber-50",
  APPROVED: "bg-green-50",
  REJECTED: "bg-red-50",
}

const statusTextColor: Record<string, string> = {
  WORKING: "text-blue-600",
  SUBMITTED: "text-amber-600",
  APPROVED: "text-green-600",
  REJECTED: "text-red-600",
}

type Props = {
  attendances: Attendance[]
}

export default function AttendanceCalendar({ attendances }: Props) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear()

  const attendanceMap = new Map<string, Attendance>()
  attendances.forEach((a) => attendanceMap.set(toDateKey(a.workDate), a))

  const monthLabel = new Date(year, month, 1).toLocaleDateString("th-TH", {
    month: "long", year: "numeric",
  })

  const todayKey = toDateKey(today)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay })

  const selectedDateKey = selectedDay ? `${year}-${month + 1}-${selectedDay}` : null
  const selectedAttendance = selectedDateKey ? attendanceMap.get(selectedDateKey) : null
  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : null

  // Monthly summary
  const monthAttendances = attendances.filter((a) => {
    const local = new Date(new Date(a.workDate).getTime() + 7 * 60 * 60 * 1000)
    return local.getUTCMonth() === month && local.getUTCFullYear() === year
  })

  const totalDays = monthAttendances.length
  const totalHours = monthAttendances.reduce((sum, a) => sum + a.totalHours, 0)
  const totalOT = monthAttendances.reduce((sum, a) => sum + a.otHours, 0)
  const approvedDays = monthAttendances.filter((a) => a.status === "APPROVED").length

  return (
    <div className="space-y-4">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { setSelectedDay(null); setViewDate(new Date(year, month - 1, 1)) }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <p className="text-sm font-bold text-gray-800">{monthLabel}</p>
        <button
          onClick={() => { setSelectedDay(null); setViewDate(new Date(year, month + 1, 1)) }}
          disabled={isCurrentMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"
        >
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
            <div
              key={d}
              className={cn(
                "text-center text-[10px] font-bold py-1 tracking-wide",
                i === 0 || i === 6 ? "text-red-300" : "text-gray-300"
              )}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {blanks.map((_, i) => <div key={`b-${i}`} />)}
          {days.map((day) => {
            const dateKey = `${year}-${month + 1}-${day}`
            const attendance = attendanceMap.get(dateKey)
            const isToday = dateKey === todayKey
            const isSelected = selectedDay === day
            const isFuture = new Date(year, month, day) > today
            const dow = new Date(year, month, day).getDay()
            const isWeekend = dow === 0 || dow === 6

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                disabled={isFuture}
                className={cn(
                  "flex flex-col items-center justify-center py-2 rounded-xl transition-all relative",
                  isSelected ? "bg-gray-900" : "",
                  !isSelected && isToday ? "bg-blue-50" : "",
                  !isSelected && !isFuture && !isWeekend && attendance ? "hover:bg-gray-50 active:scale-95" : "",
                  isFuture ? "opacity-25 cursor-default" : "",
                )}
              >
                <span className={cn(
                  "text-xs font-semibold leading-none",
                  isSelected ? "text-white" :
                  isToday ? "text-blue-600" :
                  isWeekend ? "text-red-300" : "text-gray-600"
                )}>
                  {day}
                </span>
                {attendance ? (
                  <div className={cn(
                    "w-1 h-1 rounded-full mt-1",
                    isSelected ? "bg-white" : statusDot[attendance.status]
                  )} />
                ) : (
                  <div className="w-1 h-1 mt-1" />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-50">
          {Object.entries(statusLabel).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={cn("w-1.5 h-1.5 rounded-full", statusDot[key])} />
              <span className="text-[9px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className={cn(
          "rounded-2xl border p-4 space-y-3 transition-all",
          selectedAttendance
            ? `${statusCardColor[selectedAttendance.status]} border-transparent`
            : "bg-white border-gray-100"
        )}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-800">
              {selectedDate?.toLocaleDateString("th-TH", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </p>
            {selectedAttendance && (
              <span className={cn(
                "text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
                statusCardColor[selectedAttendance.status],
                statusTextColor[selectedAttendance.status],
                "border border-current/20"
              )}>
                {statusLabel[selectedAttendance.status]}
              </span>
            )}
          </div>

          {selectedAttendance ? (
            <div className="space-y-2.5">
              {selectedAttendance.site && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span>{selectedAttendance.site.name}</span>
                </div>
              )}

              {selectedAttendance.checkIns?.[0] && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock size={13} className="text-gray-400 shrink-0" />
                  <span className="font-mono">
                    {new Date(selectedAttendance.checkIns[0].checkInTime).toLocaleTimeString("th-TH", {
                      hour: "2-digit", minute: "2-digit", hour12: false,
                    })}
                    {" – "}
                    {selectedAttendance.checkIns[0].checkOutTime
                      ? new Date(selectedAttendance.checkIns[0].checkOutTime).toLocaleTimeString("th-TH", {
                          hour: "2-digit", minute: "2-digit", hour12: false,
                        })
                      : "ยังไม่ออก"}
                  </span>
                </div>
              )}

              {selectedAttendance.totalHours > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5">
                  {[
                    { label: "รวม", value: `${selectedAttendance.totalHours.toFixed(1)}h`, color: "text-gray-800" },
                    { label: "ปกติ", value: `${selectedAttendance.normalHours.toFixed(1)}h`, color: "text-gray-800" },
                    { label: "OT", value: `${selectedAttendance.otHours.toFixed(1)}h`, color: "text-orange-500" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={cn("text-base font-bold", s.color)}>{s.value}</p>
                      <p className="text-[10px] text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedAttendance.workDescription && (
                <div className="bg-white/60 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-gray-400 mb-0.5">งานที่ทำ</p>
                  <p className="text-xs text-gray-700">{selectedAttendance.workDescription}</p>
                </div>
              )}

              {selectedAttendance.issues && (
                <div className="bg-red-50 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-red-400 mb-0.5">ปัญหาที่พบ</p>
                  <p className="text-xs text-red-700">{selectedAttendance.issues}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">
              {new Date(year, month, selectedDay).getDay() === 0 ||
               new Date(year, month, selectedDay).getDay() === 6
                ? "วันหยุด"
                : "ไม่มีข้อมูลการทำงาน"}
            </p>
          )}
        </div>
      )}

      {/* Monthly summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">สรุปเดือนนี้</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "วันทำงาน", value: totalDays, color: "text-gray-800" },
            { label: "ชั่วโมง", value: totalHours.toFixed(1), color: "text-gray-800" },
            { label: "อนุมัติ", value: approvedDays, color: "text-green-600" },
            { label: "OT", value: totalOT.toFixed(1), color: "text-orange-500" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}