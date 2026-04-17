"use server";

import { redirect } from "next/navigation";
import { signIn, auth, signOut } from "../auth/auth";
import { LoginInputForm } from "../schemas/auth.schema";
import { ActionResult } from "./action.type";
import { employeeService } from "../api/employee/employee-service";
import { CreateEmployeeInput } from "../schemas/employee.schema";
import { formatActionError } from "./action.utils";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export const register = async (
  input: CreateEmployeeInput,
): Promise<ActionResult> => {
  try {
    await employeeService.create(input);
  } catch (error) {
    return formatActionError(error);
  }
  redirect("/admin/employees");
};

export const login = async (input: LoginInputForm): Promise<ActionResult> => {
  try {
    await signIn("credentials", { ...input, redirect: false });
  } catch {
    return { success: false, code: "INVALID_CREDENTIALS" };
  }

  const session = await auth();
  const role = session?.user?.role ?? "WORKER";
  const isAdmin = ADMIN_ROLES.includes(role);

  redirect(isAdmin ? "/admin" : "/dashboard");
};
export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};
