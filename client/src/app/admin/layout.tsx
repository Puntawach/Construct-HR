// app/admin/layout.tsx
import { AdminSidebar } from "@/components/layouts/admin/sidebar";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar user={currentUser} />
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>
        <main className="relative z-10 p-6">{children}</main>
      </div>
    </div>
  );
}
