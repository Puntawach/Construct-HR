// components/features/profile/profile-avatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  RoleBadge,
  EmployeeStatusBadge,
} from "@/components/shared/status-badge";
import { Camera } from "lucide-react";
import type { Employee } from "@/lib/api/employee/employee.type";
import { uploadAvatar } from "@/lib/actions/employee/employee-action";
import ImageUploadDialog from "./imageUploadDialog";

type Props = {
  employee: Employee;
};

export default function ProfileAvatar({ employee }: Props) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar + upload button */}
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={employee.avatarUrl ?? undefined} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <ImageUploadDialog
          trigger={
            <Button
              variant="outline"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow p-0"
            >
              <Camera size={14} />
            </Button>
          }
          initialUrl={employee.avatarUrl}
          title="Edit Avatar"
          onUpload={uploadAvatar}
        />
      </div>

      {/* Name + email + badges */}
      <div className="text-center">
        <p className="text-lg font-bold">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{employee.email}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <RoleBadge role={employee.role} />
          <EmployeeStatusBadge status={employee.status} />
        </div>
      </div>
    </div>
  );
}
