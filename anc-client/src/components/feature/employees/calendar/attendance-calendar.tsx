"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Attendance } from "@/lib/types";
import { toDateKey } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  WORKING: "bg-blue-500",
  SUBMITTED: "bg-amber-400",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

const statusBg: Record<string, string> = {
  WORKING: "bg-blue-50 border-blue-200",
  SUBMITTED: "bg-amber-50 border-amber-200",
  APPROVED: "bg-green-50 border-green-200",
  REJECTED: "bg-red-50 border-red-200",
};

const statusText: Record<string, string> = {
  WORKING: "text-blue-700",
  SUBMITTED: "text-amber-700",
  APPROVED: "text-green-700",
  REJECTED: "text-red-700",
};

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

type Props = {
  attendances: Attendance[];
};

export default function AttendanceCalendar({ attendances }: Props) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate(),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const attendanceMap = new Map<string, Attendance>();
  attendances.forEach((a) => {
    attendanceMap.set(toDateKey(a.workDate), a);
  });

  const monthLabel = new Date(year, month, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth =
    month === today.getMonth() && year === today.getFullYear();

  function prevMonth() {
    setSelectedDay(null);
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setSelectedDay(null);
    setViewDate(new Date(year, month + 1, 1));
  }

  const todayDateKey = toDateKey(today);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  // Selected day data
  const selectedDateKey = selectedDay
    ? `${year}-${month + 1}-${selectedDay}`
    : null;
  const selectedAttendance = selectedDateKey
    ? attendanceMap.get(selectedDateKey)
    : null;
  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : null;

  // Monthly summary
  const monthAttendances = attendances.filter((a) => {
    const TZ = 7 * 60 * 60 * 1000;
    const local = new Date(new Date(a.workDate).getTime() + TZ);
    return local.getUTCMonth() === month && local.getUTCFullYear() === year;
  });

  const totalHours = monthAttendances.reduce((sum, a) => sum + a.totalHours, 0);
  const totalOT = monthAttendances.reduce((sum, a) => sum + a.otHours, 0);

  return (
    <div className="space-y-4">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-sm font-semibold text-gray-800">{monthLabel}</h2>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar grid */}
      <Card className="border border-gray-100">
        <CardContent className="p-3">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
              <div
                key={d}
                className={cn(
                  "text-center text-[10px] font-semibold py-1",
                  i === 0 || i === 6 ? "text-red-300" : "text-gray-400",
                )}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {blanks.map((i) => (
              <div key={`blank-${i}`} />
            ))}

            {days.map((day) => {
              const dateKey = `${year}-${month + 1}-${day}`;
              const attendance = attendanceMap.get(dateKey);
              const isToday = dateKey === todayDateKey;
              const isSelected = selectedDay === day;
              const dow = new Date(year, month, day).getDay();
              const isWeekend = dow === 0 || dow === 6;
              const isFuture = new Date(year, month, day) > today;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  disabled={isFuture}
                  className={cn(
                    "flex flex-col items-center justify-center py-1.5 rounded-xl relative transition-colors",
                    isSelected && attendance && "bg-gray-900",
                    isSelected && !attendance && "bg-gray-100",
                    !isSelected && isToday && "bg-blue-50",
                    !isSelected &&
                      !isFuture &&
                      !isWeekend &&
                      "hover:bg-gray-50",
                    isFuture && "opacity-30 cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium leading-none",
                      isSelected
                        ? "text-white"
                        : isToday
                          ? "text-blue-600 font-bold"
                          : isWeekend
                            ? "text-red-300"
                            : "text-gray-600",
                      isSelected && !attendance && "text-gray-600",
                    )}
                  >
                    {day}
                  </span>
                  {attendance && (
                    <div
                      className={cn(
                        "w-1 h-1 rounded-full mt-0.5",
                        isSelected
                          ? "bg-white"
                          : statusColor[attendance.status],
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected day detail */}
      {selectedDay && (
        <Card
          className={cn(
            "border transition-all",
            selectedAttendance
              ? statusBg[selectedAttendance.status]
              : "border-gray-100 bg-gray-50",
          )}
        >
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-gray-500" />
                <p className="text-sm font-semibold text-gray-800">
                  {selectedDate?.toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              {selectedAttendance && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border font-medium",
                    statusBg[selectedAttendance.status],
                    statusText[selectedAttendance.status],
                  )}
                >
                  {statusLabel[selectedAttendance.status]}
                </span>
              )}
            </div>

            {selectedAttendance ? (
              <div className="space-y-2.5">
                {/* Site */}
                {selectedAttendance.site && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span>{selectedAttendance.site.name}</span>
                  </div>
                )}

                {/* Time */}
                {selectedAttendance.checkIns?.[0] && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span>
                      {new Date(
                        selectedAttendance.checkIns[0].checkInTime,
                      ).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                      {" – "}
                      {selectedAttendance.checkIns[0].checkOutTime
                        ? new Date(
                            selectedAttendance.checkIns[0].checkOutTime,
                          ).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                        : "ยังไม่ออก"}
                    </span>
                  </div>
                )}

                {/* Hours breakdown */}
                {selectedAttendance.totalHours > 0 && (
                  <div className="flex items-center gap-3 pt-1 border-t border-black/5">
                    <div className="flex-1 text-center">
                      <p className="text-base font-bold text-gray-800">
                        {selectedAttendance.totalHours.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-gray-400">ชม.รวม</p>
                    </div>
                    <div className="w-px h-8 bg-black/10" />
                    <div className="flex-1 text-center">
                      <p className="text-base font-bold text-gray-800">
                        {selectedAttendance.normalHours.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-gray-400">ชม.ปกติ</p>
                    </div>
                    <div className="w-px h-8 bg-black/10" />
                    <div className="flex-1 text-center">
                      <p className="text-base font-bold text-orange-600">
                        {selectedAttendance.otHours.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-gray-400">OT</p>
                    </div>
                  </div>
                )}

                {/* Work description */}
                {selectedAttendance.workDescription && (
                  <div className="bg-white/60 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 mb-0.5">งานที่ทำ</p>
                    <p className="text-xs text-gray-700">
                      {selectedAttendance.workDescription}
                    </p>
                  </div>
                )}

                {/* Issues */}
                {selectedAttendance.issues && (
                  <div className="bg-red-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-red-400 mb-0.5">
                      ปัญหาที่พบ
                    </p>
                    <p className="text-xs text-red-700">
                      {selectedAttendance.issues}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">
                {new Date(year, month, selectedDay).getDay() === 0 ||
                new Date(year, month, selectedDay).getDay() === 6
                  ? "วันหยุด"
                  : "ไม่มีข้อมูลการทำงาน"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center flex-wrap">
        {Object.entries(statusLabel).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", statusColor[key])} />
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Monthly summary */}
      <Card className="border border-gray-100">
        <CardContent className="pt-4 pb-4 px-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            สรุปเดือนนี้
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-800">
                {monthAttendances.length}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">วันทำงาน</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-800">
                {totalHours.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">ชั่วโมงรวม</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-700">
                {monthAttendances.filter((a) => a.status === "APPROVED").length}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">อนุมัติแล้ว</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-orange-600">
                {totalOT.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">ชม. OT</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
