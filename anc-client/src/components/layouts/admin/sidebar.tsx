// components/layouts/admin/sidebar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  DollarSign,
  FileText,
  HardHat,
  LayoutDashboard,
  LogOut,
  MapPin,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CurrentUser } from "@/lib/auth/session";
import { logout } from "@/lib/actions/auth-action";

// [CONFIG] Nav items ──────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Teams", href: "/admin/teams", icon: UsersRound },
  { label: "Sites", href: "/admin/sites", icon: MapPin },
  { label: "Employees", href: "/admin/employees", icon: Users },
  { label: "Work Reports", href: "/admin/reports", icon: FileText },
  { label: "Attendance", href: "/admin/attendance", icon: ClipboardCheck },
  { label: "Payroll", href: "/admin/payroll", icon: DollarSign },
];

// [TYPES] ─────────────────────────────────────────────────────────────────────
type Props = {
  user: CurrentUser;
};

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-slate-900 text-slate-100 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
          <HardHat size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">Construction</h1>
          <p className="text-[10px] text-slate-400">Management System</p>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-slate-800" />

      {/* User profile */}
      <div className="px-4 py-4 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Avatar className="h-8 w-8 border border-slate-700">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Sign out */}
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
