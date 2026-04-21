import TeamAdminTable from "@/components/feature/admin/team/team-admin-table";
import { getTeamsAction } from "@/lib/actions/admin/team.action";
import { getAllEmployeesAction } from "@/lib/actions/admin/employee-action";

export default async function TeamPage() {
  const [teamsResult, employeesResult] = await Promise.all([
    getTeamsAction(),
    getAllEmployeesAction(),
  ]);

  const teams = teamsResult.success ? (teamsResult.data ?? []) : [];
  const employees = employeesResult.success ? (employeesResult.data ?? []) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <p className="text-white/40 text-sm">จัดการทีมงานและสมาชิก</p>
      </div>
      <TeamAdminTable teams={teams} employees={employees} />
    </div>
  );
}
