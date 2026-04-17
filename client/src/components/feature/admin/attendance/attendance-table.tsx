"use client";

import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/api/admin/team.type";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { Download } from "lucide-react";
import { useState } from "react";
import AttendanceDetailModal from "./attendance-detail-modal";
import MonthNavigator from "./attendance-monthNav";
import AttendanceGrid from "./attendance-grid";
import TeamTabs from "./attendance-team";

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
      const res = await fetch(`/api/attendance?month=${m}&year=${y}`);
      const data = await res.json();
      setAttendances(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePrevMonth() {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    await fetchAttendances(newMonth, newYear);
  }

  async function handleNextMonth() {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    await fetchAttendances(newMonth, newYear);
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
        <Button
          variant="outline"
          className="gap-2 border-white/10 hover:bg-white/5"
        >
          <Download size={16} />
          Export
        </Button>
      </div>

      <MonthNavigator
        month={month}
        year={year}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />

      <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex flex-col">
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
