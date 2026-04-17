import EmployeeList from "@/components/feature/employees/admin/employee-list";
import { getAllEmployeesAction } from "@/lib/actions/admin/employee-action";
import { getTeamsAction } from "@/lib/actions/admin/team.action";

export default async function EmployeesPage() {
  const [employeesResult, teamsResult] = await Promise.all([
    getAllEmployeesAction(),
    getTeamsAction(),
  ]);

  const employees = employeesResult.success ? (employeesResult.data ?? []) : [];
  const teams = teamsResult.success ? (teamsResult.data ?? []) : [];

  return <EmployeeList employees={employees} teams={teams} />;
}
