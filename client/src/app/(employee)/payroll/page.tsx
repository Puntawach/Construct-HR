import PayrollContent from "@/components/feature/employees/payroll/payroll-content";
import { getMyPayrollAction } from "@/lib/actions/employee/payroll.action";

export default async function PayrollPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const result = await getMyPayrollAction(month, year);
  const payroll = result.success ? (result.data ?? null) : null;

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-lg font-bold text-gray-800">เงินเดือน</h1>
        <p className="text-xs text-muted-foreground">
          สรุปค่าจ้างและชั่วโมงทำงาน
        </p>
      </div>
      <PayrollContent payroll={payroll} month={month} year={year} />
    </div>
  );
}
