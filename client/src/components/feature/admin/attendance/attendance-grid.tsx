import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Team } from "@/lib/api/admin/team.type";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { cn } from "@/lib/utils";
import AttendanceCell from "./attendance-cell";

type Props = {
  selectedTeam: Team | undefined;
  daysInMonth: Date[];
  attendances: AttendanceWithEmployee[];
  onCellClick: (att: AttendanceWithEmployee) => void;
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function getAttendance(
  attendances: AttendanceWithEmployee[],
  employeeId: string,
  day: Date,
): AttendanceWithEmployee | undefined {
  return attendances.find((a) => {
    const attDate = new Date(a.workDate);
    const localAtt = new Date(attDate.getTime() + 7 * 60 * 60 * 1000);
    return (
      a.employeeId === employeeId &&
      localAtt.getUTCDate() === day.getDate() &&
      localAtt.getUTCMonth() === day.getMonth() &&
      localAtt.getUTCFullYear() === day.getFullYear()
    );
  });
}

export default function AttendanceGrid({
  selectedTeam,
  daysInMonth,
  attendances,
  onCellClick,
}: Props) {
  const teamEmployees = selectedTeam?.employees ?? [];

  return (
    <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex flex-col">
      {/* Team header */}
      {selectedTeam && (
        <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {selectedTeam.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {selectedTeam.name}
              </h3>
              <p className="text-xs text-white/40">
                {teamEmployees.length} Members
              </p>
            </div>
          </div>
          <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/10">
            Team View
          </span>
        </div>
      )}

      {/* Scrollable table */}
      <div className="overflow-auto flex-1">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 bg-slate-900 px-4 py-3 text-left text-xs font-bold uppercase text-white/40 border-r border-white/10 border-b border-white/10 w-48 min-w-48">
                Employee
              </th>
              {daysInMonth.map((day) => {
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const isToday =
                  day.toDateString() === new Date().toDateString();
                return (
                  <th
                    key={day.toISOString()}
                    className={cn(
                      "px-1 py-2 text-center text-xs font-semibold min-w-[70px] border-r border-white/5 last:border-0 border-b border-white/10",
                      isWeekend
                        ? "bg-white/5 text-white/30"
                        : "bg-slate-900 text-white/50",
                      isToday && "bg-blue-600/20 text-blue-400",
                    )}
                  >
                    <div className="font-bold">{day.getDate()}</div>
                    <div className="text-[10px] font-normal opacity-70">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {teamEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={daysInMonth.length + 1}
                  className="py-12 text-center text-white/30"
                >
                  No employees in this team
                </td>
              </tr>
            ) : (
              teamEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                  <td className="sticky left-0 z-10 bg-slate-900 px-4 py-3 border-r border-white/10">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={emp.avatarUrl ?? undefined} />
                        <AvatarFallback className="bg-blue-600 text-white text-[10px] font-bold">
                          {getInitials(emp.firstName, emp.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  {daysInMonth.map((day) => (
                    <AttendanceCell
                      key={day.toISOString()}
                      attendance={getAttendance(attendances, emp.id, day)}
                      isWeekend={day.getDay() === 0 || day.getDay() === 6}
                      onClick={onCellClick}
                    />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
