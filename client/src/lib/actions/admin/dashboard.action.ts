"use server";

import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import { attendanceService } from "@/lib/api/attendance/attendance.service";
import { employeeService } from "@/lib/api/employee/employee-service";
import { siteService } from "@/lib/api/site/site.service";
import { teamService } from "@/lib/api/admin/team.service";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import type { Employee } from "@/lib/types";
import type { Site } from "@/lib/api/site/site.type";
import type { Team } from "@/lib/api/admin/team.type";

export type DashboardData = {
  employees: Employee[];
  sites: Site[];
  teams: Team[];
  attendances: AttendanceWithEmployee[];
};

export async function getDashboardDataAction(
  month: number,
  year: number,
): Promise<ActionResult<DashboardData>> {
  try {
    const [employees, sites, teams, attendances] = await Promise.all([
      employeeService.getAllEmployee(),
      siteService.getAll(),
      teamService.getAll(),
      attendanceService.getAllByMonth(month, year),
    ]);

    return {
      success: true,
      data: { employees, sites, teams, attendances },
    };
  } catch (error) {
    return formatActionError(error);
  }
}
