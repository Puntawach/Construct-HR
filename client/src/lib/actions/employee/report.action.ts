"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/actions/action.utils";
import type { ActionResult } from "@/lib/actions/action.type";
import { reportService } from "@/lib/api/report/report-service";
import type { ReportWithAttendance } from "@/lib/api/report/report.type";

export async function getMyReportsAction(): Promise<
  ActionResult<ReportWithAttendance[]>
> {
  try {
    const data = await reportService.getMyReports();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function createReportAction(
  attendanceId: string,
  detail: string,
  files: File[],
): Promise<ActionResult> {
  try {
    const formData = new FormData();
    formData.append("attendanceId", attendanceId);
    formData.append("detail", detail);
    files.forEach((file) => formData.append("images", file));
    await reportService.create(formData);
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
}
