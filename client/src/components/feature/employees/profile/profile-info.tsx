"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, LogOut, Loader, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/api/employee/employee.type";
import { updateMe } from "@/lib/actions/employee/employee-action";
import { logout } from "@/lib/actions/auth-action";
import { cn } from "@/lib/utils";

type Props = {
  employee: Employee;
};

type EditForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

export default function ProfileInfo({ employee }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<EditForm>({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phoneNumber: employee.phoneNumber,
    address: employee.address,
  });

  function handleSave() {
    startTransition(async () => {
      const res = await updateMe(form);
      if (res.success) setIsEditing(false);
    });
  }

  function handleCancel() {
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
    });
    setIsEditing(false);
  }

  const infoRows = [
    { label: "อีเมล", value: employee.email, editable: false },
    {
      label: "เบอร์โทร",
      value: employee.phoneNumber,
      editable: true,
      key: "phoneNumber",
    },
    {
      label: "ที่อยู่",
      value: employee.address,
      editable: true,
      key: "address",
    },
    {
      label: "เลขบัตรประชาชน",
      value: String(employee.identificationId),
      editable: false,
    },
    {
      label: "ค่าแรงรายวัน",
      value: employee.dailyRate
        ? `฿${Number(employee.dailyRate).toLocaleString("th-TH")}/วัน`
        : "–",
      editable: false,
    },
    {
      label: "เบี้ยเลี้ยง",
      value: employee.allowancePerDay
        ? `฿${Number(employee.allowancePerDay).toLocaleString("th-TH")}/วัน`
        : "–",
      editable: false,
    },
    {
      label: "วันที่เข้าทำงาน",
      value: new Date(employee.createdAt).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      editable: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Edit form */}
      {isEditing ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            แก้ไขข้อมูล
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">ชื่อ</p>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="bg-gray-50 border-gray-100 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">นามสกุล</p>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="bg-gray-50 border-gray-100 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">เบอร์โทร</p>
            <Input
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              className="bg-gray-50 border-gray-100 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-gray-400">ที่อยู่</p>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="bg-gray-50 border-gray-100 rounded-xl"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              className="flex-1 h-11 rounded-xl bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              {isPending ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button
              className="flex-1 h-11 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              onClick={handleCancel}
            >
              <X size={15} />
              ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        /* Info display */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              ข้อมูลส่วนตัว
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs text-blue-500 font-semibold"
            >
              <Pencil size={12} />
              แก้ไข
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <span className="text-sm text-gray-400 shrink-0">
                  {row.label}
                </span>
                <span className="text-sm font-medium text-gray-800 text-right ml-4 truncate">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={() => logout()}
        className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 px-5 py-4 flex items-center justify-between text-red-500 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <LogOut size={16} />
          <span className="text-sm font-semibold">ออกจากระบบ</span>
        </div>
        <ChevronRight size={16} className="text-red-300" />
      </button>
    </div>
  );
}
