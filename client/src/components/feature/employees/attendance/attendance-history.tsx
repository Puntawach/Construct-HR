"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Attendance, AttendanceStatus } from "@/lib/types";
import { toDateKey } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

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

const PAGE_SIZE = 8;

type StatusFilter = AttendanceStatus | "ALL";

type Props = {
  attendances: Attendance[];
};

export default function AttendanceHistory({ attendances }: Props) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const monthLabel = new Date(year, month, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    setPage(1);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    setPage(1);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const filtered = useMemo(() => {
    return attendances.filter((a) => {
      const d = new Date(a.workDate);
      const TZ = 7 * 60 * 60 * 1000;
      const local = new Date(d.getTime() + TZ);
      const matchMonth =
        local.getUTCMonth() === month && local.getUTCFullYear() === year;
      const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
      return matchMonth && matchStatus;
    });
  }, [attendances, month, year, statusFilter]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "ทั้งหมด", value: "ALL" },
    { label: "ทำงาน", value: "WORKING" },
    { label: "รอตรวจ", value: "SUBMITTED" },
    { label: "อนุมัติ", value: "APPROVED" },
    { label: "ไม่อนุมัติ", value: "REJECTED" },
  ];

  return (
    <div className="space-y-3">
      {/* Month navigator */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <p className="text-sm font-semibold text-gray-800">{monthLabel}</p>
        <button
          onClick={nextMonth}
          disabled={month === now.getMonth() && year === now.getFullYear()}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
              statusFilter === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
            )}
          >
            {f.label}
            {f.value !== "ALL" && (
              <span className="ml-1 opacity-60">
                (
                {
                  attendances.filter((a) => {
                    const d = new Date(a.workDate);
                    const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);
                    return (
                      local.getUTCMonth() === month &&
                      local.getUTCFullYear() === year &&
                      a.status === f.value
                    );
                  }).length
                }
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        พบ {filtered.length} รายการ
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground bg-gray-50 rounded-xl">
          ไม่มีข้อมูลในช่วงเวลานี้
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {visible.map((att) => {
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
                  className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 rounded-lg p-2 shrink-0">
                      <CalendarDays size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(att.workDate).toLocaleDateString("th-TH", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                        <Clock size={10} />
                        <span>
                          {checkInTime} – {checkOutTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[att.status]}`}
                    >
                      {statusLabel[att.status]}
                    </span>
                    {att.totalHours > 0 && (
                      <span className="text-xs text-gray-400">
                        {att.totalHours.toFixed(1)} ชม.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <Button
              variant="outline"
              className="w-full gap-2 text-sm text-gray-500 border-gray-200"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronDown size={15} />
              โหลดเพิ่ม ({filtered.length - visible.length} รายการ)
            </Button>
          )}
        </>
      )}
    </div>
  );
}
