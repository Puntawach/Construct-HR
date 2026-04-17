export type PayrollPeriod = {
  id: string;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
};

export type PayrollItem = {
  id: string;
  normalHours: number;
  otHours: number;
  workDays: number;
  normalPay: string;
  otPay: string;
  allowance: string;
  totalPay: string;
  dailyRateSnapshot: string | null;
  allowanceSnapshot: string | null;
  employeeId: string;
  payrollPeriodId: string;
  updatedAt: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    dailyRate: string | null;
    allowancePerDay: string | null;
    teamId: string | null;
  };
  payrollPeriod: PayrollPeriod;
};

export type PayrollSummary = {
  period: PayrollPeriod & { payrollItems: PayrollItem[] };
  totalPayout: number;
};
