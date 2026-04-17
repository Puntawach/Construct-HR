import type { PayrollItem } from "@/lib/api/payroll/payroll-type";
import { DollarSign, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  payroll: PayrollItem | null;
  month: number;
  year: number;
};

export default function DashboardPayroll({ payroll, month, year }: Props) {
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          เงินเดือน
        </h2>
        <span className="text-xs text-muted-foreground">{monthLabel}</span>
      </div>

      {!payroll ? (
        <Card className="border border-gray-100">
          <CardContent className="pt-4 pb-4 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <DollarSign size={18} className="text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              ยังไม่มีข้อมูลเงินเดือนเดือนนี้
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-100 overflow-hidden">
          <CardContent className="p-0">
            {/* Total */}
            <div className="bg-slate-900 px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">รายได้รวมเดือนนี้</p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  ฿
                  {Number(payroll.totalPay).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  payroll.payrollPeriod.isLocked
                    ? "bg-green-500/20 text-green-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {payroll.payrollPeriod.isLocked ? "ยืนยันแล้ว" : "รอยืนยัน"}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              {[
                {
                  icon: CalendarDays,
                  label: "วันทำงาน",
                  value: `${payroll.workDays} วัน`,
                  color: "text-blue-500",
                },
                {
                  icon: Clock,
                  label: "ชม.ปกติ",
                  value: `${payroll.normalHours.toFixed(1)} ชม.`,
                  color: "text-purple-500",
                },
                {
                  icon: Clock,
                  label: "OT",
                  value: `${payroll.otHours.toFixed(1)} ชม.`,
                  color: "text-orange-500",
                },
              ].map((s) => (
                <div key={s.label} className="px-3 py-3 text-center">
                  <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
                  <p className="text-sm font-semibold text-gray-800">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
