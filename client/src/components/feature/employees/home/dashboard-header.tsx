import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Employee } from "@/lib/types"

type Props = {
  employee: Employee
}

export default function DashboardHeader({ employee }: Props) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <p className="text-sm text-gray-400 font-medium">{greeting}</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {employee.firstName}
        </h1>
      </div>
      <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
        <AvatarImage src={employee.avatarUrl ?? undefined} />
        <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}