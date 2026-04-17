import { CheckCircle2, Clock, XCircle } from "lucide-react";
import ReportAdminTable from "@/components/feature/admin/reports/report-admin-table";
import { getReportsAction } from "@/lib/actions/admin/report.action";

export default async function ReportPage() {
  const result = await getReportsAction();
  const reports = result.success ? (result.data ?? []) : [];

  const pending = reports.filter((r) => r.status === "PENDING").length;
  const approved = reports.filter((r) => r.status === "APPROVED").length;
  const rejected = reports.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Work Reports</h1>
        <p className="text-white/40 text-sm">ตรวจสอบและอนุมัติรายงานการทำงาน</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "รอตรวจสอบ",
            value: pending,
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "อนุมัติแล้ว",
            value: approved,
            icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
          {
            label: "ไม่อนุมัติ",
            value: rejected,
            icon: XCircle,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2"
          >
            <div
              className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}
            >
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      <ReportAdminTable reports={reports} />
    </div>
  );
}
