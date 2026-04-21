import type { PayrollItem } from "@/lib/api/payroll/payroll-type";
import { CalendarDays, Clock, TrendingUp } from "lucide-react";

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

  if (!payroll) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 overflow-hidden">
      <div className="bg-gray-900 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 font-medium">
            รายได้ {monthLabel}
          </p>
          <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
            ฿{" "}
            {Number(payroll.totalPay).toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {[
          {
            icon: CalendarDays,
            label: "วันทำงาน",
            value: `${payroll.workDays}`,
            unit: "วัน",
            color: "text-blue-500",
          },
          {
            icon: Clock,
            label: "ชม.ปกติ",
            value: `${payroll.normalHours.toFixed(1)}`,
            unit: "ชม.",
            color: "text-purple-500",
          },
          {
            icon: TrendingUp,
            label: "OT",
            value: `${payroll.otHours.toFixed(1)}`,
            unit: "ชม.",
            color: "text-orange-500",
          },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center">
            <s.icon size={13} className={`${s.color} mx-auto mb-1.5`} />
            <p className="text-sm font-bold text-gray-800">
              {s.value}{" "}
              <span className="text-xs font-normal text-gray-400">
                {s.unit}
              </span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
