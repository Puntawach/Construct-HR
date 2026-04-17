// components/features/payroll/payroll-rate-warning.tsx
import { AlertTriangle } from "lucide-react";
import type { PayrollItem } from "@/lib/api/payroll/payroll-type";

type Props = {
  payrollItems: PayrollItem[];
};

export default function PayrollRateWarning({ payrollItems }: Props) {
  // compare current rate vs snapshot
  const changedEmployees = payrollItems.filter((item) => {
    const rateChanged =
      Number(item.employee.dailyRate) !== Number(item.dailyRateSnapshot);
    const allowanceChanged =
      Number(item.employee.allowancePerDay) !== Number(item.allowanceSnapshot);
    return rateChanged || allowanceChanged;
  });

  if (changedEmployees.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-bold text-amber-400 mb-1">
          Pay rates changed since last generation
        </p>
        <p className="text-amber-400/70 mb-2">
          Click Regenerate to recalculate with updated rates
        </p>
        <div className="flex flex-wrap gap-2">
          {changedEmployees.map((item) => (
            <span
              key={item.id}
              className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full"
            >
              {item.employee.firstName} {item.employee.lastName}
              {Number(item.employee.dailyRate) !==
                Number(item.dailyRateSnapshot) && (
                <span className="ml-1 opacity-60">
                  ฿{Number(item.dailyRateSnapshot).toLocaleString()} → ฿
                  {Number(item.employee.dailyRate).toLocaleString()}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
