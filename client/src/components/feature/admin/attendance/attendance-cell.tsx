import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { cn } from "@/lib/utils";

const statusCellStyle: Record<string, string> = {
  WORKING: "bg-blue-500/20 text-blue-400",
  SUBMITTED: "bg-amber-500/20 text-amber-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

type Props = {
  attendance: AttendanceWithEmployee | undefined;
  isWeekend: boolean;
  onClick: (attendance: AttendanceWithEmployee) => void;
};

export default function AttendanceCell({
  attendance: el,
  isWeekend,
  onClick,
}: Props) {
  return (
    <td
      className={cn(
        "px-1 py-0 text-center align-middle h-12 min-w-17.5 border-r border-white/5 last:border-0 transition-colors",
        el ? "cursor-pointer hover:bg-white/10" : "",
        isWeekend && "bg-white/2",
      )}
      onClick={() => el && onClick(el)}
    >
      {el ? (
        <div className="flex flex-col items-center justify-center h-full gap-0.5">
          <span
            className={cn(
              "text-xs font-bold px-1.5 py-0.5 rounded-md",
              statusCellStyle[el.status],
            )}
          >
            {el.totalHours.toFixed(1)}h
          </span>
          {el.otHours > 0 && (
            <span className="text-[10px] text-amber-400">
              OT {el.otHours.toFixed(1)}h
            </span>
          )}
        </div>
      ) : (
        <span className="text-white/10 text-xs">—</span>
      )}
    </td>
  );
}
