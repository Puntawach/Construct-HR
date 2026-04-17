"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeTable from "./employee-table";
import EmployeeDrawer from "./employee-drawer";
import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";

type Props = {
  employees: Employee[];
  teams: Team[];
};

export default function EmployeeList({ employees, teams }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // [LOGIC] filter by search + team
  const filtered = employees.filter((emp) => {
    const matchSearch = `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchTeam = selectedTeamId === "all" || emp.teamId === selectedTeamId;
    return matchSearch && matchTeam;
  });

  const memberCount =
    selectedTeamId === "all"
      ? employees.length
      : employees.filter((e) => e.teamId === selectedTeamId).length;

  const selectedEmployee = employees.find((e) => e.id === selectedId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-white/50 text-sm">Manage your workforce</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Team dropdown */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <UsersRound size={15} className="text-white/40 shrink-0" />
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">
                All Teams
              </option>
              {teams.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900">
                  {t.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full shrink-0">
              {memberCount}
            </span>
          </div>

          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/admin/employees/create")}
          >
            <Plus size={18} />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Table */}
      <EmployeeTable
        employees={filtered}
        teams={teams}
        search={search}
        setSearch={setSearch}
        onSelect={setSelectedId}
      />

      {/* Drawer */}
      <EmployeeDrawer
        employee={selectedEmployee ?? null}
        teams={teams}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
