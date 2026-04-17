"use server";

import { formatActionError } from "@/lib/actions/action.utils";
import type { ActionResult } from "@/lib/actions/action.type";
import { payrollService } from "@/lib/api/payroll/payroll-service";
import type { PayrollItem } from "@/lib/api/payroll/payroll-type";

export async function getMyPayrollAction(
  month: number,
  year: number,
): Promise<ActionResult<PayrollItem>> {
  try {
    const data = await payrollService.getMyPayroll(month, year);
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}
