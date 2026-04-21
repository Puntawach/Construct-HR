"use client";

import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/api/admin/team.type";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { Download, Loader } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AttendanceDetailModal from "./attendance-detail-modal";
import MonthNavigator from "./attendance-monthNav";
import AttendanceGrid from "./attendance-grid";
import TeamTabs from "./attendance-team";
import { exportAttendanceExcel } from "@/lib/utils/export-attendance";
import { getAttendanceByMonthAction } from "@/lib/actions/admin/attendance.action";

type Props = {
  initialAttendances: AttendanceWithEmployee[];
  teams: Team[];
  initialMonth: number;
  initialYear: number;
};

export default function AttendanceTable({
  initialAttendances,
  teams,
  initialMonth,
  initialYear,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id ?? "");
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceWithEmployee | null>(null);
  const [attendances, setAttendances] =
    useState<AttendanceWithEmployee[]>(initialAttendances);

  const daysInMonth = Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month - 1, i + 1),
  );

  async function fetchAttendances(m: number, y: number) {
    setIsLoading(true);
    try {
      const result = await getAttendanceByMonthAction(m, y);
      setAttendances(result.success ? (result.data ?? []) : []);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePrevMonth() {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    router.push(`${pathname}?month=${newMonth}&year=${newYear}`);
    await fetchAttendances(newMonth, newYear);
  }

  async function handleNextMonth() {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    router.push(`${pathname}?month=${newMonth}&year=${newYear}`);
    await fetchAttendances(newMonth, newYear);
  }

  function handleExport() {
    exportAttendanceExcel(attendances, teams, month, year);
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance Review</h1>
          <p className="text-white/40 text-sm">
            Click on any day to review or approve hours
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleExport}
          disabled={attendances.length === 0 || isLoading}
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>

      <MonthNavigator
        month={month}
        year={year}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />

      {/* Loading overlay */}
      <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Loader size={14} className="animate-spin text-white" />
              <span className="text-sm text-white">กำลังโหลด...</span>
            </div>
          </div>
        )}

        <AttendanceGrid
          selectedTeam={selectedTeam}
          daysInMonth={daysInMonth}
          attendances={attendances}
          onCellClick={setSelectedAttendance}
        />

        <TeamTabs
          teams={teams}
          selectedTeamId={selectedTeamId}
          onSelect={setSelectedTeamId}
        />
      </div>

      <AttendanceDetailModal
        attendance={selectedAttendance}
        onClose={() => setSelectedAttendance(null)}
        onAction={() => {
          setSelectedAttendance(null);
          fetchAttendances(month, year);
        }}
      />
    </div>
  );
}
