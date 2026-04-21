"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import { attendanceService } from "@/lib/api/attendance/attendance.service";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";

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

export const getAttendanceByMonthAction = async (
  month: number,
  year: number,
): Promise<ActionResult<AttendanceWithEmployee[]>> => {
  try {
    const data = await attendanceService.getAllByMonth(month, year);
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
};

export const adminEditAttendanceAction = async (
  attendanceId: string,
  normalHours: number,
  otHours: number,
  overrideNote?: string,
): Promise<ActionResult> => {
  try {
    await attendanceService.adminEdit(attendanceId, {
      normalHours,
      otHours,
      overrideNote,
    });
    revalidatePath("/admin/attendance");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};
