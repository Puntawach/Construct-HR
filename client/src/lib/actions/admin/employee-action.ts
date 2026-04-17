"use server";

import { employeeService } from "@/lib/api/employee/employee-service";
import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import type { Employee } from "@/lib/types";

export const getAllEmployeesAction = async (): Promise<
  ActionResult<Employee[]>
> => {
  try {
    const data = await employeeService.getAllEmployee();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
};

export const updateEmployee = async (
  id: string,
  data: Partial<{ dailyRate: number; allowancePerDay: number }>,
): Promise<ActionResult> => {
  try {
    await employeeService.update(id, data);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};

export const deleteEmployee = async (id: string): Promise<ActionResult> => {
  try {
    await employeeService.deleteEmployee(id);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};

export const restoreEmployee = async (id: string): Promise<ActionResult> => {
  try {
    await employeeService.restore(id);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};
