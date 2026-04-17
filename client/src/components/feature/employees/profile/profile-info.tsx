// components/features/profile/profile-info.tsx
"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, LogOut, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Employee } from "@/lib/api/employee/employee.type";
import { updateMe } from "@/lib/actions/employee/employee-action";
import { logout } from "@/lib/actions/auth-action";

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

  return (
    <div className="space-y-4">
      {/* Edit button */}
      {!isEditing && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} />
            แก้ไข
          </Button>
        </div>
      )}

      {/* Edit form */}
      {isEditing ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">แก้ไขข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ชื่อ</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>นามสกุล</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>เบอร์โทร</Label>
              <Input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>ที่อยู่</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 gap-1.5"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {isPending ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-1.5"
                onClick={handleCancel}
              >
                <X size={15} />
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Info display
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="space-y-0">
              {[
                { label: "อีเมล", value: employee.email },
                { label: "เบอร์โทร", value: employee.phoneNumber },
                { label: "ที่อยู่", value: employee.address },
                {
                  label: "เลขบัตรประชาชน",
                  value: String(employee.identificationId),
                },
                {
                  label: "ค่าแรงรายวัน",
                  value: employee.dailyRate
                    ? `฿${employee.dailyRate.toLocaleString()}/วัน`
                    : "-",
                },
                {
                  label: "เบี้ยเลี้ยง",
                  value: employee.allowancePerDay
                    ? `฿${employee.allowancePerDay.toLocaleString()}/วัน`
                    : "-",
                },
                {
                  label: "วันที่เข้าทำงาน",
                  value: new Date(employee.createdAt).toLocaleDateString(
                    "th-TH",
                    { day: "numeric", month: "long", year: "numeric" },
                  ),
                },
              ].map((row, i, arr) => (
                <div key={row.label}>
                  <div className="flex justify-between items-start py-3 gap-4">
                    <span className="text-sm text-muted-foreground shrink-0">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium text-right">
                      {row.value}
                    </span>
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign out */}
      <button
        onClick={() => logout()}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-muted rounded-lg transition-colors"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </div>
  );
}
