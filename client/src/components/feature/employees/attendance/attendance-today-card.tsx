'use client'

import type { Attendance } from "@/lib/types"
import { Clock, LogIn, LogOut, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  todayAttendance: Attendance | null
}

export default function AttendanceTodayCard({ todayAttendance }: Props) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const isCheckedIn = !!todayAttendance
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime
  const isWorking = isCheckedIn && !isCheckedOut

  const checkInTime = todayAttendance?.checkIns?.[0]?.checkInTime
    ? new Date(todayAttendance.checkIns[0].checkInTime)
    : null

  const checkOutTime = todayAttendance?.checkIns?.[0]?.checkOutTime
    ? new Date(todayAttendance.checkIns[0].checkOutTime)
    : null

  const elapsedHours = checkInTime && !isCheckedOut
    ? (currentTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    : null

  const elapsedLabel = elapsedHours !== null
    ? `${Math.floor(elapsedHours)}ชม. ${Math.floor((elapsedHours % 1) * 60)}น.`
    : null

  const timeLabel = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  })

  const secondLabel = currentTime.getSeconds().toString().padStart(2, "0")

  const dateLabel = currentTime.toLocaleDateString("th-TH", {
    weekday: "long", day: "numeric", month: "long",
  })

  const formatTime = (date: Date) => date.toLocaleTimeString("th-TH", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-6 text-center space-y-5">
      {/* Date */}
      <p className="text-xs text-gray-400 font-medium">{dateLabel}</p>

      {/* Live Clock */}
      <div>
        <p className="text-6xl font-black text-gray-900 tracking-tighter font-mono">
          {timeLabel}
          <span className="text-2xl text-gray-300 ml-1.5 font-normal">{secondLabel}</span>
        </p>
      </div>

      {/* Status info */}
      {isCheckedIn && (
        <div className="bg-gray-50 rounded-2xl px-4 py-3 space-y-2.5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Clock size={13} />เข้างาน
            </span>
            <span className="font-semibold font-mono text-gray-800">
              {checkInTime ? formatTime(checkInTime) : "-"}
            </span>
          </div>

          {isCheckedOut && checkOutTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Clock size={13} />ออกงาน
              </span>
              <span className="font-semibold font-mono text-gray-800">
                {formatTime(checkOutTime)}
              </span>
            </div>
          )}

          {isWorking && elapsedLabel && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">ระยะเวลา</span>
              <span className="font-semibold text-blue-500">{elapsedLabel}</span>
            </div>
          )}
        </div>
      )}

      {/* Status badge */}
      {isCheckedIn && (
        <div className="flex justify-center">
          <span className={cn(
            "text-xs px-3 py-1.5 rounded-full font-semibold",
            isCheckedOut
              ? "bg-green-50 text-green-600"
              : "bg-blue-50 text-blue-600"
          )}>
            {isCheckedOut ? "✓ ออกงานแล้ว" : "● กำลังทำงาน"}
          </span>
        </div>
      )}

      {/* Action button */}
      {!isCheckedOut ? (
        <div className="flex justify-center pt-2">
          {!isCheckedIn ? (
            <button
              onClick={() => router.push("/attendance/check-in")}
              className="w-32 h-32 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 flex flex-col items-center justify-center gap-2 ring-8 ring-blue-50 active:scale-95 transition-all"
            >
              <LogIn size={26} />
              <span className="text-sm font-bold">เข้างาน</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/attendance/check-out")}
              className="w-32 h-32 rounded-full bg-red-500 text-white shadow-lg shadow-red-200 flex flex-col items-center justify-center gap-2 ring-8 ring-red-50 active:scale-95 transition-all"
            >
              <LogOut size={26} />
              <span className="text-sm font-bold">ออกงาน</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center pt-2">
          <div className="w-32 h-32 rounded-full bg-gray-50 border-2 border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300">
            <CheckCircle size={26} />
            <span className="text-sm font-medium text-gray-400">เสร็จแล้ว</span>
          </div>
        </div>
      )}
    </div>
  )
}