import { api } from "../client";
import { Employee } from "../employee/employee.type";

const login = (input: unknown) =>
  api.post<{ accessToken: string; employee: Employee; expiresIn: number }>(
    "/auth/login",
    input,
  );

export const authService = { login };
