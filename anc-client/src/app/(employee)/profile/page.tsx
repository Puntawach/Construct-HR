import ProfileHeader from "@/components/feature/employees/profile/profile-header";
import { getMeAction } from "@/lib/actions/employee/employee-action";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const result = await getMeAction();

  if (!result.success || !result.data) redirect("/login");

  return (
    <div>
      <ProfileHeader employee={result.data} />
    </div>
  );
}
