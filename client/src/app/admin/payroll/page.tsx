import { getTeamsAction } from "@/lib/actions/admin/team.action";
import {
  getPayrollSummaryAction,
  generatePayroll,
} from "@/lib/actions/admin/payroll-action";
import PayrollTable from "@/components/feature/admin/payroll/payroll-table";

export default async function PayrollPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [teamsResult, summaryResult] = await Promise.all([
    getTeamsAction(),
    getPayrollSummaryAction(month, year),
  ]);

  const teams = teamsResult.success ? (teamsResult.data ?? []) : [];
  let summary = summaryResult.success ? (summaryResult.data ?? null) : null;

  // ✅ ถ้ายังไม่มี payroll เดือนนี้ — generate อัตโนมัติ
  if (!summary) {
    const generated = await generatePayroll(month, year);
    if (generated.success) {
      const newSummary = await getPayrollSummaryAction(month, year);
      summary = newSummary.success ? (newSummary.data ?? null) : null;
    }
  }

  return (
    <PayrollTable summary={summary} teams={teams} month={month} year={year} />
  );
}
