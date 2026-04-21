'use client'

import { cn } from "@/lib/utils"
import { CalendarDays, ClipboardList, Home, MapPin, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Attendance", href: "/attendance", icon: MapPin },
  { label: "Report", href: "/reports", icon: ClipboardList },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: User },
]

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2">
      <div className="mx-4 mb-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-black/5">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              >
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                  isActive ? "bg-blue-500" : "bg-transparent"
                )}>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={cn(isActive ? "text-white" : "text-gray-400")}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-blue-500" : "text-gray-400"
                )}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}