import { Attendance } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";

type Props = {
  todayAttendance: Attendance | null;
};

export default function DashboardActions({ todayAttendance }: Props) {
  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href={
          isCheckedIn && !isCheckedOut
            ? "/attendance/check-out"
            : "/attendance/check-in"
        }
      >
        <div
          className={cn(
            "rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 transition-all active:scale-95",
            isCheckedIn && !isCheckedOut
              ? "bg-red-500 text-white"
              : "bg-blue-600 text-white",
          )}
        >
          {isCheckedIn && !isCheckedOut ? (
            <LogOut size={28} />
          ) : (
            <LogIn size={28} />
          )}
          <p className="font-semibold text-sm">
            {isCheckedIn && !isCheckedOut ? "Check Out" : "Check In"}
          </p>
        </div>
      </Link>

      <Link href="/reports">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 border border-gray-100 transition-all active:scale-95">
          <FileText size={28} className="text-gray-600" />
          <div className="text-center">
            <p className="font-semibold text-sm text-gray-800">Daily Report</p>
          </div>
        </div>
      </Link>

      <Link href="/calendar">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 border border-gray-100 transition-all active:scale-95">
          <CalendarDays size={28} className="text-gray-600" />
          <p className="font-semibold text-sm text-gray-800">My Calendar</p>
        </div>
      </Link>

      <Link href="/profile">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 border border-gray-100 transition-all active:scale-95">
          <User size={28} className="text-gray-600" />
          <p className="font-semibold text-sm text-gray-800">My Profile</p>
        </div>
      </Link>
    </div>
  );
}
