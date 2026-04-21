import { getDashboardDataAction } from "@/lib/actions/admin/dashboard.action";
import { getPayrollSummaryAction } from "@/lib/actions/admin/payroll-action";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
  UsersRound,
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
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">
            ภาพรวม
          </p>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
        </div>
        <p className="text-sm text-white/30 pb-1">{monthLabel}</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "พนักงานทั้งหมด",
            value: activeEmployees,
            sub: `${employees.length} คนในระบบ`,
            icon: Users,
            accent: "blue",
          },
          {
            label: "ไซต์งาน",
            value: sites.length,
            sub: "ไซต์ที่เปิดใช้งาน",
            icon: MapPin,
            accent: "violet",
          },
          {
            label: "ทีมงาน",
            value: teams.length,
            sub: "ทีมทั้งหมด",
            icon: UsersRound,
            accent: "cyan",
          },
          {
            label: "การเข้างาน",
            value: attendances.length,
            sub: `${totalHours.toFixed(0)} ชม.`,
            icon: ClipboardCheck,
            accent: "emerald",
          },
        ].map((s) => {
          const accentMap: Record<
            string,
            { border: string; icon: string; text: string }
          > = {
            blue: {
              border: "border-blue-500/20",
              icon: "text-blue-400",
              text: "text-blue-400",
            },
            violet: {
              border: "border-violet-500/20",
              icon: "text-violet-400",
              text: "text-violet-400",
            },
            cyan: {
              border: "border-cyan-500/20",
              icon: "text-cyan-400",
              text: "text-cyan-400",
            },
            emerald: {
              border: "border-emerald-500/20",
              icon: "text-emerald-400",
              text: "text-emerald-400",
            },
          };
          const ac = accentMap[s.accent];
          return (
            <div
              key={s.label}
              className={`rounded-2xl border ${ac.border} bg-white/3 p-5 space-y-4`}
            >
              <div className="flex items-center justify-between">
                <s.icon size={16} className={ac.icon} />
                <span className="text-[10px] text-white/20 uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-white tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs text-white/30 mt-1">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content — 2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Attendance status — 3 col */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/3 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">สถานะการเข้างาน</h2>
              <p className="text-xs text-white/30 mt-0.5">{monthLabel}</p>
            </div>
            <div
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                approvalRate >= 80
                  ? "bg-green-500/10 text-green-400"
                  : approvalRate >= 50
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
              }`}
            >
              อนุมัติ {approvalRate}%
            </div>
          </div>

          {/* Donut-style breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "กำลังทำงาน",
                value: working,
                color: "bg-blue-500",
                badge: "bg-blue-500/10 text-blue-400",
              },
              {
                label: "รอตรวจสอบ",
                value: submitted,
                color: "bg-amber-400",
                badge: "bg-amber-500/10 text-amber-400",
              },
              {
                label: "อนุมัติแล้ว",
                value: approved,
                color: "bg-green-500",
                badge: "bg-green-500/10 text-green-400",
              },
              {
                label: "ไม่อนุมัติ",
                value: rejected,
                color: "bg-red-500",
                badge: "bg-red-500/10 text-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{s.label}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}
                  >
                    {s.value}
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full`}
                    style={{
                      width: `${attendances.length > 0 ? (s.value / attendances.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hours bar */}
          <div className="border-t border-white/5 pt-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/30">
              <span>ชั่วโมงทำงาน</span>
              <span>{totalHours.toFixed(1)} ชม. รวม</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${totalHours > 0 ? ((totalHours - totalOT) / totalHours) * 100 : 0}%`,
                  }}
                />
                <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${totalHours > 0 ? (totalOT / totalHours) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-white/40">
                  ปกติ {(totalHours - totalOT).toFixed(1)} ชม.
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-white/40">
                  OT {totalOT.toFixed(1)} ชม.
                </span>
              </div>
            </div>
            {totalOT > 0 && (
              <div className="flex items-center gap-2 text-xs text-orange-400/70">
                <AlertTriangle size={11} />
                <span>
                  OT คิดเป็น {Math.round((totalOT / totalHours) * 100)}%
                  ของเวลางานทั้งหมด
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payroll — 2 col */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/3 p-6 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">เงินเดือน</h2>
              <p className="text-xs text-white/30 mt-0.5">{monthLabel}</p>
            </div>
            <DollarSign size={15} className="text-white/20" />
          </div>

          {payrollSummary ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-1 py-4">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                  ยอดรวมทั้งหมด
                </p>
                <p className="text-4xl font-bold text-white tracking-tight">
                  ฿
                  {Number(payrollSummary.totalPayout).toLocaleString("th-TH", {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-white/20">
                  {payrollSummary.period.payrollItems.length} คน • เฉลี่ย ฿
                  {payrollSummary.period.payrollItems.length > 0
                    ? Math.round(
                        Number(payrollSummary.totalPayout) /
                          payrollSummary.period.payrollItems.length,
                      ).toLocaleString("th-TH")
                    : 0}
                  /คน
                </p>
              </div>

              <Link
                href="/admin/payroll"
                className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <span className="text-xs text-white/50">
                  ดูรายละเอียดเงินเดือน
                </span>
                <ArrowRight
                  size={14}
                  className="text-white/30 group-hover:text-white/60 transition-colors"
                />
              </Link>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <DollarSign size={20} className="text-white/20" />
              </div>
              <p className="text-sm text-white/30">ยังไม่มีข้อมูลเงินเดือน</p>
              <Link
                href="/admin/payroll"
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                ไปที่หน้าเงินเดือน →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row — Top workers + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top workers */}
        {topWorkers.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Top พนักงาน</h2>
                <p className="text-xs text-white/30 mt-0.5">
                  ชั่วโมงทำงานสูงสุดเดือนนี้
                </p>
              </div>
              <TrendingUp size={15} className="text-white/20" />
            </div>

            <div className="space-y-4">
              {topWorkers.map((w, i) => (
                <div key={w.name} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0
                        ? "bg-blue-500 text-white"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/80 truncate">{w.name}</p>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {w.ot > 0 && (
                          <span className="text-[10px] text-orange-400">
                            +{w.ot.toFixed(1)}h OT
                          </span>
                        )}
                        <span className="text-xs font-bold text-white">
                          {w.hours.toFixed(1)}h
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${i === 0 ? "bg-blue-500" : "bg-white/15"}`}
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
        {submitted > 0 ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/3 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">รอการอนุมัติ</h2>
                <p className="text-xs text-white/30 mt-0.5">
                  {submitted} รายการ
                </p>
              </div>
              <Link
                href="/admin/attendance"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                ดูทั้งหมด <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2">
              {attendances
                .filter((a) => a.status === "SUBMITTED")
                .slice(0, 4)
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0">
                      {a.employee.firstName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {a.employee.firstName} {a.employee.lastName}
                      </p>
                      <p className="text-xs text-white/30">
                        {new Date(a.workDate).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}
                        {" · "}
                        {a.totalHours.toFixed(1)} ชม.
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 shrink-0">
                      รอตรวจสอบ
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/3 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-400">
                ทุกรายการได้รับการอนุมัติแล้ว
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                ไม่มีรายการรอตรวจสอบ
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
