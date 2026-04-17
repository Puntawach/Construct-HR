import { getDashboardDataAction } from "@/lib/actions/admin/dashboard.action";
import {
  Users,
  MapPin,
  UsersRound,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const result = await getDashboardDataAction(month, year);

  if (!result.success || !result.data) {
    return <div className="text-white/40 text-sm">ไม่สามารถโหลดข้อมูลได้</div>;
  }

  const { employees, sites, teams, attendances, payrollSummary } = result.data;
  const submitted = attendances.filter((a) => a.status === "SUBMITTED").length;
  const approved = attendances.filter((a) => a.status === "APPROVED").length;
  const rejected = attendances.filter((a) => a.status === "REJECTED").length;
  const working = attendances.filter((a) => a.status === "WORKING").length;

  const stats = [
    {
      label: "พนักงานทั้งหมด",
      value: employees.length,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "ไซต์งาน",
      value: sites.length,
      icon: MapPin,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "ทีมงาน",
      value: teams.length,
      icon: UsersRound,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      label: "การทำงานเดือนนี้",
      value: attendances.length,
      icon: ClipboardCheck,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  const attendanceStats = [
    {
      label: "กำลังทำงาน",
      value: working,
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "รอตรวจสอบ",
      value: submitted,
      icon: Clock,
      color: "text-amber-400",
    },
    {
      label: "อนุมัติแล้ว",
      value: approved,
      icon: CheckCircle2,
      color: "text-green-400",
    },
    {
      label: "ไม่อนุมัติ",
      value: rejected,
      icon: XCircle,
      color: "text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm">ภาพรวมระบบจัดการการเข้างาน</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}
            >
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance status */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              สถานะการเข้างานเดือนนี้
            </h2>
            <p className="text-xs text-white/40">
              {now.toLocaleDateString("th-TH", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {attendanceStats.map((s) => (
              <div key={s.label} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon size={14} className={s.color} />
                  <span className="text-xs text-white/40">{s.label}</span>
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              สรุปเงินเดือนเดือนนี้
            </h2>
            <p className="text-xs text-white/40">
              {now.toLocaleDateString("th-TH", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {payrollSummary ? (
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-xs text-white/40 mb-1">ยอดรวมทั้งหมด</p>
                <p className="text-3xl font-bold text-white">
                  ฿
                  {payrollSummary.totalPayout.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-xs text-white/40">พนักงาน</p>
                  <p className="font-bold text-white">
                    {payrollSummary.period.payrollItems.length} คน
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-xs text-white/40">สถานะ</p>
                  <p
                    className={`font-bold ${payrollSummary.period.isLocked ? "text-red-400" : "text-green-400"}`}
                  >
                    {payrollSummary.period.isLocked ? "ล็อคแล้ว" : "ยังไม่ล็อค"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white/20 space-y-2">
              <DollarSign size={32} />
              <p className="text-sm">ยังไม่มีข้อมูลเงินเดือน</p>
            </div>
          )}
        </div>
      </div>

      {/* Pending attendances */}
      {submitted > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">รอการอนุมัติ</h2>
              <p className="text-xs text-white/40">
                {submitted} รายการรอตรวจสอบ
              </p>
            </div>
            <Link
              href="/admin/attendance"
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="space-y-2">
            {attendances
              .filter((a) => a.status === "SUBMITTED")
              .slice(0, 5)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400">
                      {a.employee.firstName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {a.employee.firstName} {a.employee.lastName}
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(a.workDate).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        — {a.totalHours.toFixed(1)} ชม.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                    รอตรวจสอบ
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
