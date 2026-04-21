import { Attendance } from "@/lib/types"
import { Clock } from "lucide-react"
import Link from "next/link"

type Props = {
  todayAttendance: Attendance | null
}

export default function DashboardUpdate({ todayAttendance }: Props) {
  const isCheckedIn = !!todayAttendance
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime

  const updates = [
    ...(!isCheckedIn ? [{
      id: "shift",
      title: "ยังไม่ได้เข้างาน",
      desc: "กดเข้างานเพื่อเริ่มบันทึกเวลา",
      action: "เข้างาน",
      href: "/attendance/check-in",
      color: "bg-blue-50 text-blue-600",
      iconColor: "text-blue-400",
    }] : []),
    ...(isCheckedIn && !isCheckedOut ? [{
      id: "checkout",
      title: "กำลังทำงานอยู่",
      desc: "อย่าลืมกดออกงานเมื่อเสร็จ",
      action: "ออกงาน",
      href: "/attendance/check-out",
      color: "bg-amber-50 text-amber-600",
      iconColor: "text-amber-400",
    }] : []),
  ]

  if (updates.length === 0) return null

  return (
    <div className="space-y-2">
      {updates.map((update) => (
        <div
          key={update.id}
          className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between border border-gray-100 shadow-sm shadow-black/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
              <Clock size={16} className={update.iconColor} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{update.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{update.desc}</p>
            </div>
          </div>
          <Link
            href={update.href}
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl"
          >
            {update.action}
          </Link>
        </div>
      ))}
    </div>
  )
}