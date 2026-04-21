import SiteAdminTable from "@/components/feature/admin/site/site-admin-table";
import { getSitesAction } from "@/lib/actions/admin/site.action";

export default async function SitesPage() {
  const result = await getSitesAction();
  const sites = result.success ? (result.data ?? []) : [];

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sites</h1>
        <p className="text-white/40 text-sm">จัดการไซต์งานทั้งหมด</p>
      </div>
      <SiteAdminTable sites={sites} defaultMonth={defaultMonth} />
    </div>
  );
}
