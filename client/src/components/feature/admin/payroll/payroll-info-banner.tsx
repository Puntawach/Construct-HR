// components/features/payroll/payroll-info-banner.tsx
import { Info } from "lucide-react";

export default function PayrollInfoBanner() {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
      <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
      <div className="text-sm text-blue-300">
        <p className="font-bold mb-1">Calculation Logic</p>
        <p className="text-blue-300/70">
          Wages are calculated from{" "}
          <span className="font-bold text-blue-300">APPROVED</span> attendance
          only
        </p>
        <ul className="list-disc list-inside mt-1 text-blue-300/60 space-y-0.5">
          <li>Normal Pay = Work Days × Daily Rate</li>
          <li>OT Pay = OT Hours × (Daily Rate / 8) × 1.5</li>
          <li>Allowance = Work Days × Allowance/Day</li>
        </ul>
      </div>
    </div>
  );
}
