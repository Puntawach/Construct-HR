import { Attendance } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Briefcase, MapPin } from "lucide-react";

type Props = {
  todayAttendance: Attendance | null;
};

export default function DashboardCardStatus({ todayAttendance }: Props) {
  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = !!todayAttendance?.checkIns?.[0]?.checkOutTime;
  const workedHours = todayAttendance?.totalHours ?? 0;

  return (
    <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4">
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            isCheckedIn && !isCheckedOut
              ? "bg-green-500/20 text-green-400"
              : "bg-white/10 text-white/60",
          )}
        >
          {isCheckedIn && !isCheckedOut ? "● On Duty" : "● Off Duty"}
        </span>
        <div className="text-right">
          <p className="text-[10px] text-white/50 uppercase tracking-wide">
            Worked Today
          </p>
          <p className="text-2xl font-bold">
            {workedHours > 0 ? `${workedHours.toFixed(1)}h` : "0h"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Current Assignment
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-blue-400" />
            <p className="font-semibold">
              {todayAttendance?.site?.name ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
