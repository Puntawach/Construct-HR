import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { PayrollItem } from "@/lib/api/payroll/payroll-type";

type Props = {
  item: PayrollItem;
  isExpanded: boolean;
  teamName: string;
  onToggle: () => void;
};

const thb = (value: string | number) =>
  `฿${Number(value).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;

export default function PayrollRow({
  item,
  isExpanded,
  teamName,
  onToggle,
}: Props) {
  const initials =
    `${item.employee.firstName[0]}${item.employee.lastName[0]}`.toUpperCase();

  const updatedAt = new Date(item.updatedAt).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <tr
        className={cn(
          "hover:bg-white/5 transition-colors cursor-pointer",
          isExpanded && "bg-white/5",
        )}
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-white/30">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">
                {item.employee.firstName} {item.employee.lastName}
              </p>
              <p className="text-xs text-white/40">{teamName}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-right text-white/70">
          {item.workDays} วัน
        </td>
        <td className="px-4 py-3 text-right text-white/70">
          {thb(item.normalPay)}
        </td>
        <td className="px-4 py-3 text-right text-amber-400">
          {thb(item.otPay)}
        </td>
        <td className="px-4 py-3 text-right text-white/70">
          {thb(item.allowance)}
        </td>
        <td className="px-4 py-3 text-right font-bold text-blue-400">
          {thb(item.totalPay)}
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-white/[0.02]">
          <td colSpan={7} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              {/* Hours breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-white/30">
                  ชั่วโมงทำงาน
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: "ชม.ปกติ",
                      value: `${item.normalHours.toFixed(1)} ชม.`,
                      color: "text-white",
                    },
                    {
                      label: "ชม. OT",
                      value: `${item.otHours.toFixed(1)} ชม.`,
                      color: "text-amber-400",
                    },
                    {
                      label: "รวมทั้งหมด",
                      value: `${(item.normalHours + item.otHours).toFixed(1)} ชม.`,
                      color: "text-blue-400",
                    },
                    {
                      label: "วันทำงาน",
                      value: `${item.workDays} วัน`,
                      color: "text-white",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-white/50">{row.label}</span>
                      <span className={cn("font-medium", row.color)}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pay breakdown */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-white/30">
                  การคำนวณ
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: "ค่าแรงปกติ",
                      formula: `${item.normalHours.toFixed(1)}h × ฿${Number(item.employee.dailyRate ?? 0).toLocaleString()}/8`,
                      value: thb(item.normalPay),
                      color: "text-white",
                    },
                    {
                      label: "OT Pay",
                      formula: `${item.otHours.toFixed(1)}h × 1.5x`,
                      value: thb(item.otPay),
                      color: "text-amber-400",
                    },
                    {
                      label: "เบี้ยเลี้ยง",
                      formula: `${item.workDays} วัน × ฿${Number(item.employee.allowancePerDay ?? 0).toLocaleString()}`,
                      value: thb(item.allowance),
                      color: "text-white",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-start text-sm gap-2"
                    >
                      <div>
                        <p className="text-white/50">{row.label}</p>
                        <p className="text-[10px] text-white/25">
                          {row.formula}
                        </p>
                      </div>
                      <span className={cn("font-medium shrink-0", row.color)}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary + meta */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-white/30">
                  สรุป
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  {[
                    {
                      label: "Normal Pay",
                      value: thb(item.normalPay),
                      color: "text-white",
                    },
                    {
                      label: "OT Pay",
                      value: thb(item.otPay),
                      color: "text-amber-400",
                    },
                    {
                      label: "Allowance",
                      value: thb(item.allowance),
                      color: "text-white",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-white/60">{row.label}</span>
                      <span className={row.color}>{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
                    <span className="text-white">Total Pay</span>
                    <span className="text-blue-400">{thb(item.totalPay)}</span>
                  </div>
                </div>

                {/* Last updated */}
                <div className="flex items-center gap-1.5 text-xs text-white/25">
                  <Clock size={11} />
                  <span>อัพเดทล่าสุด {updatedAt}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
