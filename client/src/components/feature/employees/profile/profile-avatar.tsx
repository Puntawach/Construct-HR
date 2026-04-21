import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import type { Employee } from "@/lib/api/employee/employee.type"
import { uploadAvatar } from "@/lib/actions/employee/employee-action"
import ImageUploadDialog from "./imageUploadDialog"
import { RoleBadge } from "@/components/shared/status-badge"

type Props = {
  employee: Employee
}

export default function ProfileAvatar({ employee }: Props) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
          <AvatarImage src={employee.avatarUrl ?? undefined} />
          <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <ImageUploadDialog
          trigger={
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Camera size={14} className="text-gray-600" />
            </button>
          }
          initialUrl={employee.avatarUrl}
          title="เปลี่ยนรูปโปรไฟล์"
          onUpload={uploadAvatar}
        />
      </div>

      <div className="text-center">
        <p className="text-xl font-bold text-gray-900">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">{employee.email}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <RoleBadge role={employee.role} />
        </div>
      </div>
    </div>
  )
}