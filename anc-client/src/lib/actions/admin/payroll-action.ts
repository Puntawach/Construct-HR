"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import { payrollService } from "@/lib/api/payroll/payroll-service";
import type { PayrollSummary } from "@/lib/api/payroll/payroll-type";

export const generatePayroll = async (
  month: number,
  year: number,
): Promise<ActionResult> => {
  try {
    await payrollService.generate(month, year);
    revalidatePath("/admin/payroll");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};

export const getPayrollSummaryAction = async (
  month: number,
  year: number,
): Promise<ActionResult<PayrollSummary>> => {
  try {
    const data = await payrollService.getSummary(month, year);
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
};
