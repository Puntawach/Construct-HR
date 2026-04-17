import { api } from "@/lib/api/client";
import { PayrollItem, PayrollSummary } from "./payroll-type";

const generate = (month: number, year: number) =>
  api.post<PayrollSummary>("/payroll/generate", { month, year });

const getSummary = (month: number, year: number) =>
  api.get<PayrollSummary>(`/payroll/summary?month=${month}&year=${year}`);

const getMyPayroll = (month: number, year: number) =>
  api.get<PayrollItem>(`/payroll/me?month=${month}&year=${year}`);

export const payrollService = { generate, getSummary, getMyPayroll };
