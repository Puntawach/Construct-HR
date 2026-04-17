import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/lib/types";

type Props = {
  employee: Employee;
};

export default function DashboardHeader({ employee }: Props) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <p className="text-xs text-gray-400">{employee.firstName}</p>
        <h1 className="text-lg font-bold text-gray-900">
          Hi, {employee.firstName}
        </h1>
      </div>
      <Avatar className="h-12 w-12">
        <AvatarImage src={employee.avatarUrl ?? undefined} />
      </Avatar>
    </div>
  );
}
