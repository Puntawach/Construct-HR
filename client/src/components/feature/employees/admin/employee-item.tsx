"use client";

import { useState } from "react";
import EmployeeDrawer from "./employee-drawer";
import { Team } from "@/lib/api/admin/team.type";
import { Employee } from "@/lib/api/employee/employee.type";

type Props = {
  employee: Employee;
  team: Team | null;
};

export default function EmployeeItem({ employee, team }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {employee.firstName} {employee.lastName}
      </div>

      <EmployeeDrawer
        employee={open ? employee : null}
        teams={team ? [team] : []}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
