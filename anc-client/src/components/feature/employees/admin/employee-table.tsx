"use client";

import { Search } from "lucide-react";
import EmployeeRow from "./employee-row";
import { Employee } from "@/lib/api/employee/employee.type";
import { Team } from "@/lib/api/admin/team.type";

type Props = {
  employees: Employee[];
  teams: Team[];
  search: string;
  setSearch: (v: string) => void;
  onSelect: (id: string) => void;
};

export default function EmployeeTable({
  employees,
  teams,
  search,
  setSearch,
  onSelect,
}: Props) {
  const getTeam = (teamId: string | null) =>
    teams.find((t) => t.id === teamId) ?? null;

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
      {/* Search */}
      <div className="p-4 border-b border-white/10 flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={16}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left">
        <thead className="border-b border-white/10 text-white/40 text-xs uppercase">
          <tr>
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Team</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
            <th className="px-6 py-4 text-right">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-white/30">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((el) => (
              <EmployeeRow
                key={el.id}
                employee={el}
                team={getTeam(el.teamId ?? null)}
                onSelect={onSelect}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
