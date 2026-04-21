"use client";

import { useState, useTransition } from "react";
import { X, Save, Loader, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";
import {
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
} from "@/lib/actions/admin/employee-action";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/shared/confirm-dialog";

type Props = {
  employee: Employee | null;
  teams: Team[];
  onClose: () => void;
};

type RateForm = {
  dailyRate: string;
  allowancePerDay: string;
};

export default function EmployeeDrawer({ employee, teams, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [form, setForm] = useState<RateForm>({
    dailyRate: "",
    allowancePerDay: "",
  });

  if (!employee) return null;

  const emp = employee as NonNullable<typeof employee>;
  const isDeleted = emp.status === "DELETE";
  const initials = `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase();
  const teamName = teams.find((t) => t.id === emp.teamId)?.name ?? "Unassigned";

  function handleEditRate() {
    setForm({
      dailyRate: String(emp.dailyRate ?? ""),
      allowancePerDay: String(emp.allowancePerDay ?? ""),
    });
    setIsEditingRate(true);
  }

  function handleSaveRate() {
    startTransition(async () => {
      const res = await updateEmployee(emp.id, {
        dailyRate: Number(form.dailyRate),
        allowancePerDay: Number(form.allowancePerDay),
      });
      if (res.success) {
        setIsEditingRate(false);
        router.refresh();
      }
    });
  }

  function handleConfirmDelete() {
    startTransition(async () => {
      await deleteEmployee(emp.id);
      setShowDeleteConfirm(false);
      router.refresh();
      onClose();
    });
  }

  function handleConfirmRestore() {
    startTransition(async () => {
      await restoreEmployee(emp.id);
      setShowRestoreConfirm(false);
      router.refresh();
      onClose();
    });
  }

  return (
    <>
      <ConfirmDialog
        open={showDeleteConfirm}
        title={`ลบ ${emp.firstName} ${emp.lastName}?`}
        description="พนักงานจะถูกปิดการใช้งาน สามารถ restore ได้ภายหลัง"
        confirmLabel="ลบพนักงาน"
        variant="danger"
        isPending={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        open={showRestoreConfirm}
        title={`คืนสถานะ ${emp.firstName} ${emp.lastName}?`}
        description="พนักงานจะกลับมาใช้งานได้ตามปกติ"
        confirmLabel="คืนสถานะ"
        variant="default"
        isPending={isPending}
        onConfirm={handleConfirmRestore}
        onCancel={() => setShowRestoreConfirm(false)}
      />

      <AnimatePresence>
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-slate-900 w-full max-w-md h-full border-l border-white/10 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex justify-between items-start">
              <div className="flex gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={emp.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-blue-600 text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-white font-bold">
                    {emp.firstName} {emp.lastName}
                  </h2>
                  <p className="text-white/50 text-sm">{emp.email}</p>
                  <p className="text-white/30 text-xs mt-0.5">{teamName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-white/30">
                  Details
                </p>
                {[
                  { label: "Phone", value: emp.phoneNumber },
                  { label: "Address", value: emp.address },
                  { label: "ID Number", value: String(emp.identificationId) },
                  { label: "Role", value: emp.role },
                  { label: "Status", value: emp.status },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-white/40">{row.label}</span>
                    <span className="text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Pay Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase text-white/30 flex items-center gap-1.5">
                    <DollarSign size={12} />
                    Pay Rate
                  </p>
                  {!isEditingRate && (
                    <button
                      onClick={handleEditRate}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingRate ? (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">
                        Daily Rate (฿)
                      </Label>
                      <Input
                        type="number"
                        value={form.dailyRate}
                        onChange={(e) =>
                          setForm({ ...form, dailyRate: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/60 text-xs">
                        Allowance / Day (฿)
                      </Label>
                      <Input
                        type="number"
                        value={form.allowancePerDay}
                        onChange={(e) =>
                          setForm({ ...form, allowancePerDay: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={handleSaveRate}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/10 text-white/70 hover:bg-white/5"
                        onClick={() => setIsEditingRate(false)}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Daily Rate</span>
                      <span className="text-white font-medium">
                        {emp.dailyRate ? (
                          `฿${Number(emp.dailyRate).toLocaleString("th-TH")}/day`
                        ) : (
                          <span className="text-white/20">Not set</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Allowance/Day</span>
                      <span className="text-white font-medium">
                        {emp.allowancePerDay ? (
                          `฿${Number(emp.allowancePerDay).toLocaleString("th-TH")}/day`
                        ) : (
                          <span className="text-white/20">Not set</span>
                        )}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                      <span className="text-white/40">Hourly Rate</span>
                      <span className="text-blue-400 font-medium">
                        {emp.dailyRate ? (
                          `฿${(Number(emp.dailyRate) / 8).toLocaleString("th-TH", { minimumFractionDigits: 2 })}/hr`
                        ) : (
                          <span className="text-white/20">-</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Danger Zone */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <p className="text-xs font-bold uppercase text-white/30">
                  Danger Zone
                </p>
                {isDeleted ? (
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowRestoreConfirm(true)}
                    disabled={isPending}
                  >
                    Restore Employee
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isPending}
                  >
                    Delete Employee
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
