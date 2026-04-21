import ProfileHeader from "@/components/feature/employees/profile/profile-header"
import { getMeAction } from "@/lib/actions/employee/employee-action"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const result = await getMeAction()
  if (!result.success || !result.data) redirect("/login")

  return (
    <div className="pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">โปรไฟล์</h1>
        <p className="text-sm text-gray-400 mt-0.5">ข้อมูลส่วนตัว</p>
      </div>
      <ProfileHeader employee={result.data} />
    </div>
  )
}