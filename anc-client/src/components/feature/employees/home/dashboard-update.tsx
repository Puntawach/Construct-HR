import { Attendance } from "@/lib/types";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";

type Props = {
  todayAttendance: Attendance | null;
};

export default function DashboardUpdate({ todayAttendance }: Props) {
  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime;

  const updates = [
    ...(!isCheckedIn
      ? [
          {
            id: "shift",
            type: "shift",
            title: "Shift Not Started",
            desc: "You haven't checked in yet.",
            action: "Check In",
            href: "/attendance/check-in",
          },
        ]
      : []),
    ...(isCheckedIn && !isCheckedOut
      ? [
          {
            id: "checkout",
            type: "shift",
            title: "Shift In Progress",
            desc: "Remember to check out when done.",
            action: "Check Out",
            href: "/attendance/check-out",
          },
        ]
      : []),
  ];

  if (updates.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Todays Updates
      </h2>
      <div className="space-y-2">
        {updates.map((update) => (
          <div
            key={update.id}
            className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                {update.type === "report" ? (
                  <FileText size={16} className="text-gray-500" />
                ) : (
                  <Clock size={16} className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {update.title}
                </p>
                <p className="text-xs text-gray-400">{update.desc}</p>
              </div>
            </div>
            <Link
              href={update.href}
              className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              {update.action}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
