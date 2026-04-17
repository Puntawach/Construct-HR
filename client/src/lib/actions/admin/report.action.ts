"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import { reportService } from "@/lib/api/report/report-service";
import { ReportWithAttendance } from "@/lib/api/report/report.type";

export const approveReport = async (
  reportId: string,
): Promise<ActionResult> => {
  try {
    await reportService.approveReport(reportId);
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};

export const rejectReport = async (reportId: string): Promise<ActionResult> => {
  try {
    await reportService.rejectReport(reportId);
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};
export async function getReportsAction(): Promise<
  ActionResult<ReportWithAttendance[]>
> {
  try {
    const data = await reportService.getAllReports();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}
