import { teamService } from "@/lib/api/admin/team.service";
import { getPayrollSummaryAction } from "@/lib/actions/admin/payroll-action";
import PayrollTable from "@/components/feature/admin/payroll/payroll-table";

export default async function PayrollPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [teams, summaryResult] = await Promise.all([
    teamService.getAll(),
    getPayrollSummaryAction(month, year),
  ]);

  const summary = summaryResult.success ? (summaryResult.data ?? null) : null;

  return (
    <PayrollTable summary={summary} teams={teams} month={month} year={year} />
  );
}
