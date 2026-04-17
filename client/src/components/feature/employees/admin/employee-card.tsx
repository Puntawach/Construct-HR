import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";

type Props = {
  employee: Employee;
  team: Team | null;
};

export default function EmployeeCard({ employee, team }: Props) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={employee.avatarUrl ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div>
          <p className="text-white font-medium">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-white/40">{employee.email}</p>
        </div>
      </div>

      <div className="text-sm text-white/60 space-y-1">
        <p>Role: {employee.role}</p>
        <p>Team: {team?.name ?? "Unassigned"}</p>
        <p>Status: {employee.status}</p>
      </div>
    </div>
  );
}
