import { getDashboardDataAction } from "@/lib/actions/admin/dashboard.action";
import { getPayrollSummaryAction } from "@/lib/actions/admin/payroll-action";
import {
  Users,
  MapPin,
  UsersRound,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [dashboardResult, payrollResult] = await Promise.all([
    getDashboardDataAction(month, year),
    getPayrollSummaryAction(month, year),
  ]);

  if (!dashboardResult.success || !dashboardResult.data) {
    return <div className="text-white/40 text-sm">ไม่สามารถโหลดข้อมูลได้</div>;
  }

  const { employees, sites, teams, attendances } = dashboardResult.data;
  const payrollSummary = payrollResult.success
    ? (payrollResult.data ?? null)
    : null;

  const activeEmployees = employees.filter((e) => e.status === "ACTIVE").length;
  const submitted = attendances.filter((a) => a.status === "SUBMITTED").length;
  const approved = attendances.filter((a) => a.status === "APPROVED").length;
  const rejected = attendances.filter((a) => a.status === "REJECTED").length;
  const working = attendances.filter((a) => a.status === "WORKING").length;
  const totalOT = attendances.reduce((sum, a) => sum + a.otHours, 0);
  const totalHours = attendances.reduce((sum, a) => sum + a.totalHours, 0);
  const approvalRate =
    attendances.length > 0
      ? Math.round((approved / (approved + rejected || 1)) * 100)
      : 0;

  // Top workers by hours
  const employeeHours = attendances.reduce<
    Record<string, { name: string; hours: number; ot: number }>
  >((acc, a) => {
    const id = a.employee.id;
    if (!acc[id])
      acc[id] = {
        name: `${a.employee.firstName} ${a.employee.lastName}`,
        hours: 0,
        ot: 0,
      };
    acc[id].hours += a.totalHours;
    acc[id].ot += a.otHours;
    return acc;
  }, {});

  const topWorkers = Object.values(employeeHours)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  const maxHours = topWorkers[0]?.hours ?? 1;

  const monthLabel = now.toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm">{monthLabel}</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "พนักงานทั้งหมด",
            value: activeEmployees,
            sub: `จากทั้งหมด ${employees.length} คน`,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "ไซต์งาน",
            value: sites.length,
            sub: "ไซต์งานที่เปิดใช้งาน",
            icon: MapPin,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            label: "ทีมงาน",
            value: teams.length,
            sub: "ทีมทั้งหมดในระบบ",
            icon: UsersRound,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "การเข้างานเดือนนี้",
            value: attendances.length,
            sub: `${totalHours.toFixed(0)} ชม. รวม`,
            icon: ClipboardCheck,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
        ].map((s) => (
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
              <p className="text-[10px] text-white/25 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance breakdown */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                สถานะการเข้างาน
              </h2>
              <p className="text-xs text-white/40">{monthLabel}</p>
            </div>
            <Activity size={15} className="text-white/20" />
          </div>

          <div className="space-y-2.5">
            {[
              {
                label: "กำลังทำงาน",
                value: working,
                total: attendances.length,
                color: "bg-blue-500",
                text: "text-blue-400",
              },
              {
                label: "รอตรวจสอบ",
                value: submitted,
                total: attendances.length,
                color: "bg-amber-400",
                text: "text-amber-400",
              },
              {
                label: "อนุมัติแล้ว",
                value: approved,
                total: attendances.length,
                color: "bg-green-500",
                text: "text-green-400",
              },
              {
                label: "ไม่อนุมัติ",
                value: rejected,
                total: attendances.length,
                color: "bg-red-500",
                text: "text-red-400",
              },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">{s.label}</span>
                  <span className={`font-bold ${s.text}`}>{s.value}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all`}
                    style={{
                      width: `${s.total > 0 ? (s.value / s.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Approval rate */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Approval Rate</span>
              <span
                className={`text-sm font-bold ${approvalRate >= 80 ? "text-green-400" : approvalRate >= 50 ? "text-amber-400" : "text-red-400"}`}
              >
                {approvalRate}%
              </span>
            </div>
          </div>
        </div>

        {/* OT & Hours insight */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">ชั่วโมงทำงาน</h2>
              <p className="text-xs text-white/40">{monthLabel}</p>
            </div>
            <TrendingUp size={15} className="text-white/20" />
          </div>

          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                รวมทั้งหมด
              </p>
              <p className="text-3xl font-bold text-white">
                {totalHours.toFixed(1)}
              </p>
              <p className="text-xs text-white/40">ชั่วโมง</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[10px] text-white/40 mb-1">ปกติ</p>
                <p className="text-lg font-bold text-white">
                  {(totalHours - totalOT).toFixed(1)}
                </p>
                <p className="text-[10px] text-white/30">ชม.</p>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-3 text-center border border-orange-500/20">
                <p className="text-[10px] text-orange-400 mb-1">OT</p>
                <p className="text-lg font-bold text-orange-400">
                  {totalOT.toFixed(1)}
                </p>
                <p className="text-[10px] text-orange-400/60">ชม.</p>
              </div>
            </div>

            {totalOT > 0 && (
              <div className="flex items-center gap-2 bg-orange-500/5 border border-orange-500/20 rounded-xl px-3 py-2">
                <AlertTriangle size={12} className="text-orange-400 shrink-0" />
                <p className="text-xs text-orange-400">
                  OT คิดเป็น {Math.round((totalOT / totalHours) * 100)}%
                  ของเวลางานทั้งหมด
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payroll summary */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">เงินเดือน</h2>
              <p className="text-xs text-white/40">{monthLabel}</p>
            </div>
            <DollarSign size={15} className="text-white/20" />
          </div>

          {payrollSummary ? (
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                  ยอดรวม
                </p>
                <p className="text-3xl font-bold text-white">
                  ฿
                  {payrollSummary.totalPayout.toLocaleString("th-TH", {
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-white/40 mb-1">พนักงาน</p>
                  <p className="text-lg font-bold text-white">
                    {payrollSummary.period.payrollItems.length}
                  </p>
                  <p className="text-[10px] text-white/30">คน</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-white/40 mb-1">เฉลี่ย/คน</p>
                  <p className="text-lg font-bold text-white">
                    ฿
                    {payrollSummary.period.payrollItems.length > 0
                      ? Math.round(
                          payrollSummary.totalPayout /
                            payrollSummary.period.payrollItems.length,
                        ).toLocaleString("th-TH")
                      : 0}
                  </p>
                </div>
              </div>

              <Link
                href="/admin/payroll"
                className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/5 rounded-xl border border-blue-500/10 transition-colors"
              >
                ดูรายละเอียด →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white/20 space-y-2">
              <DollarSign size={32} />
              <p className="text-sm">ยังไม่มีข้อมูลเงินเดือน</p>
              <Link href="/admin/payroll" className="text-xs text-blue-400">
                ไปที่หน้า Payroll →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Top workers */}
      {topWorkers.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                ชั่วโมงทำงานสูงสุด
              </h2>
              <p className="text-xs text-white/40">Top 5 พนักงาน เดือนนี้</p>
            </div>
            <TrendingUp size={15} className="text-white/20" />
          </div>

          <div className="space-y-3">
            {topWorkers.map((w, i) => (
              <div key={w.name} className="flex items-center gap-4">
                <span className="text-xs text-white/20 w-4 text-right shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/80">{w.name}</p>
                    <div className="flex items-center gap-3">
                      {w.ot > 0 && (
                        <span className="text-[10px] text-orange-400">
                          OT {w.ot.toFixed(1)}h
                        </span>
                      )}
                      <span className="text-sm font-bold text-white">
                        {w.hours.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-blue-500" : "bg-white/20"}`}
                      style={{ width: `${(w.hours / maxHours) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending approvals */}
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
                  className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5"
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
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
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
