"use client";

import { useState, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getMyPayrollAction } from "@/lib/actions/employee/payroll.action";
import type { PayrollItem } from "@/lib/api/payroll/payroll-type";

type Props = {
  payroll: PayrollItem | null;
  month: number;
  year: number;
};

export default function PayrollContent({
  payroll: initialPayroll,
  month: initialMonth,
  year: initialYear,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [payroll, setPayroll] = useState<PayrollItem | null>(initialPayroll);

  const now = new Date();
  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear();

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  function fetchPayroll(m: number, y: number) {
    startTransition(async () => {
      const result = await getMyPayrollAction(m, y);
      setPayroll(result.success ? (result.data ?? null) : null);
    });
  }

  function prevMonth() {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    fetchPayroll(newMonth, newYear);
  }

  function nextMonth() {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    fetchPayroll(newMonth, newYear);
  }

  const totalPay = payroll ? Number(payroll.totalPay) : 0;
  const normalPay = payroll ? Number(payroll.normalPay) : 0;
  const otPay = payroll ? Number(payroll.otPay) : 0;
  const allowance = payroll ? Number(payroll.allowance) : 0;

  return (
    <div className="space-y-4">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={isPending}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-sm font-semibold text-gray-800">{monthLabel}</h2>
        <button
          onClick={nextMonth}
          disabled={isPending || isCurrentMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {isPending ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          กำลังโหลด...
        </div>
      ) : !payroll ? (
        <div className="text-center py-12 space-y-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <DollarSign size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            ยังไม่มีข้อมูลเงินเดือนเดือนนี้
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Total pay card */}
          <Card className="bg-slate-900 border-0">
            <CardContent className="pt-6 pb-6 text-center space-y-1">
              <p className="text-xs text-white/40 uppercase tracking-wide">
                รายได้รวม
              </p>
              <p className="text-4xl font-bold text-white">
                ฿
                {totalPay.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border border-gray-100">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={15} className="text-blue-500" />
                  <span className="text-xs text-muted-foreground">
                    วันทำงาน
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {payroll.workDays}
                </p>
                <p className="text-xs text-muted-foreground">วัน</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-100">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={15} className="text-purple-500" />
                  <span className="text-xs text-muted-foreground">
                    ชั่วโมงรวม
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {(payroll.normalHours + payroll.otHours).toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">ชั่วโมง</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-100">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={15} className="text-orange-500" />
                  <span className="text-xs text-muted-foreground">OT</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {payroll.otHours.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">ชั่วโมง</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-100">
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={15} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    เบี้ยเลี้ยง
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  ฿{allowance.toLocaleString("th-TH")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown */}
          <Card className="border border-gray-100">
            <CardContent className="pt-4 pb-4 px-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                รายละเอียด
              </p>
              {[
                {
                  label: "ค่าแรงปกติ",
                  value: normalPay,
                  sub: `${payroll.normalHours.toFixed(1)} ชม.`,
                },
                {
                  label: "ค่าล่วงเวลา (OT)",
                  value: otPay,
                  sub: `${payroll.otHours.toFixed(1)} ชม.`,
                },
                {
                  label: "เบี้ยเลี้ยง",
                  value: allowance,
                  sub: `${payroll.workDays} วัน`,
                },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm text-gray-700">{row.label}</p>
                      <p className="text-xs text-muted-foreground">{row.sub}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      ฿
                      {row.value.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  {i < arr.length - 1 && <div className="h-px bg-gray-100" />}
                </div>
              ))}
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between pt-1">
                <p className="text-sm font-bold text-gray-800">รวมทั้งหมด</p>
                <p className="text-sm font-bold text-gray-800">
                  ฿
                  {totalPay.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
