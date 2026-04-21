import { Attendance } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CalendarDays, FileText, LogIn, LogOut, User } from "lucide-react"
import Link from "next/link"

type Props = {
  todayAttendance: Attendance | null
}

export default function DashboardActions({ todayAttendance }: Props) {
  const isCheckedIn = !!todayAttendance
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime

  const actions = [
    {
      href: isCheckedIn && !isCheckedOut ? "/attendance/check-out" : "/attendance/check-in",
      icon: isCheckedIn && !isCheckedOut ? LogOut : LogIn,
      label: isCheckedIn && !isCheckedOut ? "Check Out" : "Check In",
      primary: true,
      danger: isCheckedIn && !isCheckedOut,
    },
    { href: "/reports", icon: FileText, label: "Report", primary: false },
    { href: "/calendar", icon: CalendarDays, label: "Calendar", primary: false },
    { href: "/profile", icon: User, label: "Profile", primary: false },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map(({ href, icon: Icon, label, primary, danger }) => (
        <Link key={href} href={href}>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all active:scale-95",
              danger
                ? "bg-red-500 shadow-red-200"
                : primary
                  ? "bg-blue-500 shadow-blue-200"
                  : "bg-white border border-gray-200/80 shadow-black/5"
            )}>
              <Icon
                size={22}
                className={cn(
                  primary ? "text-white" : "text-gray-600"
                )}
              />
            </div>
            <span className="text-[11px] font-medium text-gray-500">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}