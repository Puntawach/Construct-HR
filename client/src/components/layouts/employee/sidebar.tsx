// components/layouts/employee/sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, ClipboardList, Home, MapPin, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Check In", href: "/attendance", icon: MapPin },
  { label: "Report", href: "/reports", icon: ClipboardList },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: User },
];

export function EmployeeSidebar() {
  const pathname = usePathname();

  return (
    // ── Mobile bottom nav ────────────────────────────────────────────────────
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 ">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600",
            )}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              className={cn(isActive && "scale-110 transition-transform")}
            />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
