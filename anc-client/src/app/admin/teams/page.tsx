import TeamAdminTable from "@/components/feature/admin/team/team-admin-table";
import { teamService } from "@/lib/api/admin/team.service";
import { employeeService } from "@/lib/api/employee/employee-service";

export default async function TeamPage() {
  const [teams, employees] = await Promise.all([
    teamService.getAll().catch(() => []),
    employeeService.getAllEmployee().catch(() => []),
  ]);

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
