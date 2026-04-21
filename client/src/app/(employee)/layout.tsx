import { EmployeeSidebar } from "@/components/layouts/employee/sidebar"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F7] md:flex md:items-start md:justify-center">
      <div className="relative w-full md:max-w-md min-h-screen bg-[#F5F5F7]">
        <main className="px-4 pt-6 pb-28">{children}</main>
        <EmployeeSidebar />
      </div>
    </div>
  )
}