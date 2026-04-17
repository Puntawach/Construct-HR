"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import { attendanceService } from "@/lib/api/attendance/attendance.service";

export const approve = async (attendanceId: string): Promise<ActionResult> => {
  try {
    await attendanceService.approve(attendanceId);
    revalidatePath("/admin/attendance");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};

export const reject = async (attendanceId: string): Promise<ActionResult> => {
  try {
    await attendanceService.reject(attendanceId);
    revalidatePath("/admin/attendance");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};
