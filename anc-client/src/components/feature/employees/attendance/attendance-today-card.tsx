"use client";

import type { Attendance } from "@/lib/types";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  todayAttendance: Attendance | null;
};

export default function AttendanceTodayCard({ todayAttendance }: Props) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime;

  const checkInTime = todayAttendance?.checkIns?.[0]?.checkInTime
    ? new Date(todayAttendance.checkIns[0].checkInTime)
    : null;

  const elapsedHours =
    checkInTime && !isCheckedOut
      ? (currentTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
      : null;

  const elapsedLabel =
    elapsedHours !== null
      ? `${Math.floor(elapsedHours)}ชม. ${Math.floor((elapsedHours % 1) * 60)}น.`
      : null;

  const checkInLabel = checkInTime
    ? checkInTime.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  const checkOutLabel = todayAttendance?.checkIns?.[0]?.checkOutTime
    ? new Date(todayAttendance.checkIns[0].checkOutTime).toLocaleTimeString(
        "th-TH",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
      )
    : null;

  const timeLabel = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const secondLabel = currentTime
    .toLocaleTimeString("th-TH", {
      second: "2-digit",
      hour12: false,
    })
    .replace(/[^0-9]/g, "");

  const dateLabel = currentTime.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-6">
      {/* Date */}
      <div>
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
      </div>

      {/* Live Clock */}
      <div>
        <p className="text-5xl font-black text-gray-900 tracking-tighter font-mono">
          {timeLabel}
          <span className="text-2xl text-gray-400 ml-1 font-normal">
            {secondLabel}
          </span>
        </p>
      </div>

      {/* Status info */}
      {isCheckedIn && (
        <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={14} />
              <span>เข้างาน</span>
            </div>
            <span className="font-semibold font-mono text-gray-800">
              {checkInLabel}
            </span>
          </div>

          {isCheckedOut && checkOutLabel && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} />
                <span>ออกงาน</span>
              </div>
              <span className="font-semibold font-mono text-gray-800">
                {checkOutLabel}
              </span>
            </div>
          )}

          {!isCheckedOut && elapsedLabel && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">ระยะเวลา</span>
              <span className="font-semibold text-blue-600">
                {elapsedLabel}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Status badge */}
      {isCheckedIn && (
        <div className="flex justify-center">
          <span
            className={`text-xs px-3 py-1 rounded-full border font-medium ${
              isCheckedOut
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-blue-100 text-blue-700 border-blue-200 animate-pulse"
            }`}
          >
            {isCheckedOut ? "ออกงานแล้ว" : "● กำลังทำงาน"}
          </span>
        </div>
      )}

      {/* Big round button */}
      {!isCheckedOut && (
        <div className="flex justify-center pt-2">
          {!isCheckedIn ? (
            <button
              onClick={() => router.push("/attendance/check-in")}
              className="w-36 h-36 rounded-full bg-linear-to-b from-blue-500 to-blue-700 text-white shadow-xl shadow-blue-200 flex flex-col items-center justify-center gap-2 ring-8 ring-blue-50 ring-offset-2 active:scale-95 transition-transform"
            >
              <LogIn size={28} />
              <span className="text-base font-bold">เข้างาน</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/attendance/check-out")}
              className="w-36 h-36 rounded-full bg-linear-to-b from-orange-500 to-red-600 text-white shadow-xl shadow-red-200 flex flex-col items-center justify-center gap-2 ring-8 ring-orange-50 ring-offset-2 active:scale-95 transition-transform"
            >
              <LogOut size={28} />
              <span className="text-base font-bold">ออกงาน</span>
            </button>
          )}
        </div>
      )}

      {/* Already done */}
      {isCheckedOut && (
        <div className="flex justify-center pt-2">
          <div className="w-36 h-36 rounded-full bg-gray-100 border-2 border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
            <LogOut size={28} />
            <span className="text-sm font-medium">เสร็จแล้ว</span>
          </div>
        </div>
      )}
    </div>
  );
}
