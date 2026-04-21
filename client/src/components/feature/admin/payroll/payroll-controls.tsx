"use client";

import type { Team } from "@/lib/api/admin/team.type";

type Props = {
  monthStr: string;
  selectedTeamId: string;
  teams: Team[];
  totalPayout: number | null;
  onMonthChange: (value: string) => void;
  onTeamChange: (value: string) => void;
};

export default function PayrollControls({
  monthStr,
  selectedTeamId,
  teams,
  totalPayout,
  onMonthChange,
  onTeamChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
      <input
        type="month"
        value={monthStr}
        onChange={(e) => onMonthChange(e.target.value)}
        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />

      <select
        value={selectedTeamId}
        onChange={(e) => onTeamChange(e.target.value)}
        className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      >
        <option value="all" className="bg-slate-900">
          ทุกทีม
        </option>
        {teams.map((t) => (
          <option key={t.id} value={t.id} className="bg-slate-900">
            {t.name}
          </option>
        ))}
      </select>

      {totalPayout !== null && (
        <div className="ml-auto text-right">
          <p className="text-xs text-white/40 uppercase tracking-wider">
            ยอดรวมทั้งหมด
          </p>
          <p className="text-2xl font-bold text-white">
            ฿{" "}
            {totalPayout.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  );
}
