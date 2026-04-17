"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";
import { deleteEmployee } from "@/lib/actions/admin/employee-action";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/shared/confirm-dialog";

type Props = {
  employee: Employee;
  team: Team | null;
  onSelect: (id: string) => void;
};

export default function EmployeeRow({ employee, team, onSelect }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
  const isDeleted = employee.status === "DELETED";

  function handleConfirmDelete() {
    startTransition(async () => {
      await deleteEmployee(employee.id);
      setShowConfirm(false);
      router.refresh();
    });
  }

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title={`ลบ ${employee.firstName} ${employee.lastName}?`}
        description="พนักงานจะถูกปิดการใช้งาน สามารถ restore ได้ภายหลัง"
        confirmLabel="ลบพนักงาน"
        variant="danger"
        isPending={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <tr
        className="hover:bg-white/5 cursor-pointer transition-colors"
        onClick={() => onSelect(employee.id)}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={employee.avatarUrl ?? undefined} />
              <AvatarFallback
                className={isDeleted ? "bg-gray-600" : "bg-blue-600"}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p
                className={`font-medium ${isDeleted ? "text-white/40 line-through" : "text-white"}`}
              >
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-xs text-white/40">{employee.email}</p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-white/70">{employee.role}</td>

        <td className="px-6 py-4 text-white/70">
          {team?.name ?? (
            <span className="text-white/30 text-xs italic">Unassigned</span>
          )}
        </td>

        <td className="px-6 py-4">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              employee.status === "ACTIVE"
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {employee.status}
          </span>
        </td>

        <td className="px-6 py-4 text-right">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(employee.id);
            }}
          >
            <Edit2 className="text-white/60" size={16} />
          </Button>
        </td>

        <td className="px-6 py-4 text-right">
          {!isDeleted && (
            <Button
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
            >
              <Trash2 className="text-red-400" size={16} />
            </Button>
          )}
        </td>
      </tr>
    </>
  );
}
