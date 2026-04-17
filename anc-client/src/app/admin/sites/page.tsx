import SiteAdminTable from "@/components/feature/admin/site/site-admin-table";
import { getSitesAction } from "@/lib/actions/admin/site.action";

export default async function SitesPage() {
  const result = await getSitesAction();
  const sites = result.success ? (result.data ?? []) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sites</h1>
        <p className="text-white/40 text-sm">จัดการไซต์งานทั้งหมด</p>
      </div>
      <SiteAdminTable sites={sites} />
    </div>
  );
}
