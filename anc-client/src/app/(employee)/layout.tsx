import { EmployeeSidebar } from "@/components/layouts/employee/sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-300 md:flex md:items-start md:justify-center">
      <div className="relative w-full md:max-w-107.5 min-h-screen bg-gray-50 md:min-h-screen">
        <main className="p-4 pb-24">{children}</main>
        <EmployeeSidebar />
      </div>
    </div>
  );
}
