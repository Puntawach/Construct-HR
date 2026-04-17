// components/features/profile/profile-header.tsx
import type { Employee } from "@/lib/api/employee/employee.type";
import ProfileAvatar from "./profile-avatar";
import ProfileInfo from "./profile-info";

type Props = {
  employee: Employee;
};

export default function ProfileHeader({ employee }: Props) {
  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      <ProfileAvatar employee={employee} />
      <ProfileInfo employee={employee} />
    </div>
  );
}
