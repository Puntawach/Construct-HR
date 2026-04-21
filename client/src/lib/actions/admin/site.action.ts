"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/actions/action.utils";
import type { ActionResult } from "@/lib/actions/action.type";
import { siteService, type SitePayload } from "@/lib/api/site/site.service";
import type { Site } from "@/lib/api/site/site.type";
import { attendanceService } from "@/lib/api/attendance/attendance.service";
import { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";

export async function getSitesAction(): Promise<ActionResult<Site[]>> {
  try {
    const data = await siteService.getAll();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function createSiteAction(
  payload: SitePayload,
): Promise<ActionResult<Site>> {
  try {
    const data = await siteService.create(payload);
    revalidatePath("/admin/sites");
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function updateSiteAction(
  id: string,
  payload: Partial<SitePayload>,
): Promise<ActionResult<Site>> {
  try {
    const data = await siteService.update(id, payload);
    revalidatePath("/admin/sites");
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function deleteSiteAction(id: string): Promise<ActionResult> {
  try {
    await siteService.remove(id);
    revalidatePath("/admin/sites");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
}
export async function getSiteAttendanceAction(
  siteId: string,
): Promise<ActionResult<AttendanceWithEmployee[]>> {
  try {
    const data = await attendanceService.getBySite(siteId);
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}
