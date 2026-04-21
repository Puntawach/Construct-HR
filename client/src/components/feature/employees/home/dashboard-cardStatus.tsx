import { Attendance } from "@/lib/types"
import { MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  todayAttendance: Attendance | null
}

export default function DashboardCardStatus({ todayAttendance }: Props) {
  const isCheckedIn = !!todayAttendance
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime
  const isWorking = isCheckedIn && !isCheckedOut
  const workedHours = todayAttendance?.totalHours ?? 0

  const checkInTime = todayAttendance?.checkIns?.[0]?.checkInTime
    ? new Date(todayAttendance.checkIns[0].checkInTime).toLocaleTimeString("th-TH", {
        hour: "2-digit", minute: "2-digit", hour12: false,
      })
    : null

  return (
    <div className={cn(
      "rounded-2xl p-5 space-y-4",
      isWorking
        ? "bg-blue-500"
        : isCheckedOut
          ? "bg-gray-900"
          : "bg-gray-900"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            isWorking
              ? "bg-white/20 text-white"
              : "bg-white/10 text-white/50"
          )}>
            {isWorking ? "● On Duty" : isCheckedOut ? "● Shift Complete" : "● Off Duty"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/50 uppercase tracking-widest">Today</p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {workedHours > 0 ? `${workedHours.toFixed(1)}h` : "–"}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {todayAttendance?.site?.name && (
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-white/50 shrink-0" />
            <p className="text-sm font-medium text-white">
              {todayAttendance.site.name}
            </p>
          </div>
        )}
        {checkInTime && (
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-white/50 shrink-0" />
            <p className="text-sm text-white/70">
              เข้างาน {checkInTime}
            </p>
          </div>
        )}
        {!isCheckedIn && (
          <p className="text-sm text-white/40">ยังไม่ได้เข้างานวันนี้</p>
        )}
      </div>
    </div>
  )
}