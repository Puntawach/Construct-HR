import { Employee } from "@/lib/api/employee/employee.type";

export type Team = {
  id: string;
  name: string;
  leaderId: string | null;
  leader: Employee | null;
  employees: Employee[];
  deletedAt: string | null;
};
