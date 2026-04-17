"use server";

import { employeeService } from "@/lib/api/employee/employee-service";
import type { UpdateMeInput } from "@/lib/api/employee/employee.type";
import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/actions/action.utils";
import type { ActionResult } from "@/lib/actions/action.type";
import type { Employee } from "@/lib/types";

export const getMeAction = async (): Promise<ActionResult<Employee>> => {
  try {
    const data = await employeeService.getMe();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
};

export const updateMe = async (data: UpdateMeInput): Promise<ActionResult> => {
  try {
    await employeeService.updateMe(data);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};

export const uploadAvatar = async (file: File): Promise<ActionResult> => {
  const formData = new FormData();
  formData.append("avatar", file);
  try {
    await employeeService.uploadAvatar(formData);
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};
