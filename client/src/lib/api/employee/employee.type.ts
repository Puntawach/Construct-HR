export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type Role = "WORKER" | "LEADER" | "ADMIN" | "SUPER_ADMIN";

export type Employee = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  identificationId: number;
  role: Role;
  status: EmployeeStatus;
  avatarUrl: string | null;
  dailyRate: number;
  allowancePerDay: number | null;
  createdAt: string;
  updatedAt: string;
  teamId: string | null;
};

export type UpdateMeInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};
