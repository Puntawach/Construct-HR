// components/features/payroll/payroll-table.tsx
"use client";

import { useState, useTransition } from "react";
import { Clock, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayrollHeader from "./payroll-header";
import PayrollInfoBanner from "./payroll-info-banner";
import PayrollControls from "./payroll-controls";
import PayrollRow from "./payroll-row";
import type { PayrollSummary } from "@/lib/api/payroll/payroll-type";
import type { Team } from "@/lib/api/admin/team.type";
import PayrollRateWarning from "./payroll-rate-warning";
import {
  generatePayroll,
  getPayrollSummaryAction,
} from "@/lib/actions/admin/payroll-action";

type Props = {
  summary: PayrollSummary | null;
  teams: Team[];
  month: number;
  year: number;
};
export default function PayrollTable({
  summary: initialSummary,
  teams,
  month: initialMonth,
  year: initialYear,
}: Props) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [summary, setSummary] = useState<PayrollSummary | null>(initialSummary);
  const [selectedTeamId, setSelectedTeamId] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // [API] fetch summary when month changes
  async function fetchSummary(m: number, y: number) {
    const result = await getPayrollSummaryAction(m, y);
    setSummary(result.success ? (result.data ?? null) : null);
  }

  function handleMonthChange(value: string) {
    const [y, m] = value.split("-").map(Number);
    setMonth(m);
    setYear(y);
    fetchSummary(m, y);
  }

  function handleGenerate() {
    startTransition(async () => {
      const res = await generatePayroll(month, year);
      if (res.success) await fetchSummary(month, year);
    });
  }

  // [LOGIC] filter by team
  const payrollItems = summary?.period.payrollItems ?? [];
  const filtered =
    selectedTeamId === "all"
      ? payrollItems
      : payrollItems.filter((item) => item.employee.teamId === selectedTeamId);

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  const getTeamName = (teamId: string | null) =>
    teams.find((t) => t.id === teamId)?.name ?? "Unassigned";

  return (
    <div className="space-y-6">
      <PayrollHeader
        hasSummary={!!summary}
        isPending={isPending}
        onGenerate={handleGenerate}
      />

      <PayrollInfoBanner />
      {summary && (
        <PayrollRateWarning payrollItems={summary.period.payrollItems} />
      )}
      <PayrollControls
        monthStr={monthStr}
        selectedTeamId={selectedTeamId}
        teams={teams}
        totalPayout={summary ? Number(summary.totalPayout) : null}
        onMonthChange={handleMonthChange}
        onTeamChange={setSelectedTeamId}
      />

      {/* Empty State */}
      {!summary && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-white/30 text-lg mb-2">No payroll generated yet</p>
          <p className="text-white/20 text-sm mb-6">
            Click Generate Payroll to calculate wages for this month
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Generate Payroll
          </Button>
        </div>
      )}

      {/* Table */}
      {summary && (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-white/10 text-white/40 text-xs uppercase">
                <tr>
                  <th className="w-10 px-4 py-3"></th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3 text-right">Work Days</th>
                  <th className="px-4 py-3 text-right">Normal Pay</th>
                  <th className="px-4 py-3 text-right">OT Pay</th>
                  <th className="px-4 py-3 text-right">Allowance</th>
                  <th className="px-4 py-3 text-right font-black text-white">
                    Total Pay
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/30">
                      No payroll data found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <PayrollRow
                      key={item.id}
                      item={item}
                      isExpanded={expandedId === item.id}
                      teamName={getTeamName(item.employee.teamId)}
                      onToggle={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Last updated */}
      {summary && (
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <Clock size={11} />
          <span>
            อัพเดทล่าสุด{" "}
            {new Date(summary.period.updatedAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
