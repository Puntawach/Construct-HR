"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  approve,
  reject,
  adminEditAttendanceAction,
} from "@/lib/actions/admin/attendance.action";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Loader,
  X,
  XCircle,
  Pencil,
  AlertTriangle,
} from "lucide-react";
import { useState, useTransition } from "react";

type Props = {
  attendance: AttendanceWithEmployee | null;
  onClose: () => void;
  onAction: () => void;
};

const statusStyle: Record<string, string> = {
  WORKING: "bg-blue-500/20 text-blue-400",
  SUBMITTED: "bg-amber-500/20 text-amber-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

export default function AttendanceDetailModal({
  attendance,
  onClose,
  onAction,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [showEdit, setShowEdit] = useState(false);
  const [normalHours, setNormalHours] = useState("");
  const [otHours, setOtHours] = useState("");
  const [overrideNote, setOverrideNote] = useState("");

  if (!attendance) return null;

  const initials =
    `${attendance.employee.firstName[0]}${attendance.employee.lastName[0]}`.toUpperCase();
  const checkIn = attendance.checkIns[0];
  const totalEdited = (Number(normalHours) || 0) + (Number(otHours) || 0);

  function openEdit() {
    setNormalHours(attendance!.normalHours.toFixed(1));
    setOtHours(attendance!.otHours.toFixed(1));
    setOverrideNote("");
    setShowEdit(true);
  }

  function handleApprove() {
    startTransition(async () => {
      const res = await approve(attendance!.id);
      if (res.success) {
        onAction();
        onClose();
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      const res = await reject(attendance!.id);
      if (res.success) {
        onAction();
        onClose();
      }
    });
  }

  function handleSaveEdit() {
    const n = Number(normalHours);
    const o = Number(otHours);
    if (isNaN(n) || isNaN(o) || n < 0 || o < 0) return;
    startTransition(async () => {
      const res = await adminEditAttendanceAction(
        attendance!.id,
        n,
        o,
        overrideNote || undefined,
      );
      if (res.success) {
        onAction();
        setShowEdit(false);
      }
    });
  }

  // แปลง decimal hours เป็น readable
  function formatHours(h: number) {
    const whole = Math.floor(h);
    const min = Math.round((h - whole) * 60);
    if (min === 0) return `${whole} ชม.`;
    return `${whole} ชม. ${min} นาที`;
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-white">
                ตรวจสอบการเข้างาน
              </h3>
              <p className="text-sm text-white/40 mt-0.5">
                {new Date(attendance.workDate).toLocaleDateString("th-TH", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Employee */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={attendance.employee.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-blue-600 text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-white">
                  {attendance.employee.firstName} {attendance.employee.lastName}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[attendance.status]}`}
                >
                  {statusLabel[attendance.status]}
                </span>
              </div>
            </div>

            {/* Hours breakdown */}
            {!showEdit ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "รวมทั้งหมด",
                      value: formatHours(attendance.totalHours),
                    },
                    {
                      label: "ปกติ",
                      value: formatHours(attendance.normalHours),
                    },
                    { label: "OT", value: formatHours(attendance.otHours) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/5 rounded-xl p-3 border border-white/10 text-center"
                    >
                      <p className="text-sm font-bold text-white">
                        {item.value}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Manual override badge */}
                {attendance.isManualOverride && (
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                    <AlertTriangle
                      size={12}
                      className="text-amber-400 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-amber-400 font-semibold">
                        แก้ไขโดย Admin
                      </p>
                      {attendance.overrideNote && (
                        <p className="text-xs text-amber-400/60 mt-0.5">
                          {attendance.overrideNote}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit button */}
                <button
                  onClick={openEdit}
                  className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  <Pencil size={11} />
                  แก้ไขชั่วโมงทำงาน
                </button>
              </div>
            ) : (
              /* Edit form */
              <div className="space-y-4 bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  แก้ไขชั่วโมงทำงาน
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40">ชม. ปกติ</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={normalHours}
                        onChange={(e) => setNormalHours(e.target.value)}
                        className="bg-transparent text-white text-sm w-full focus:outline-none"
                        placeholder="0.0"
                      />
                      <span className="text-xs text-white/30 shrink-0">
                        ชม.
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/40">ชม. OT</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        value={otHours}
                        onChange={(e) => setOtHours(e.target.value)}
                        className="bg-transparent text-white text-sm w-full focus:outline-none"
                        placeholder="0.0"
                      />
                      <span className="text-xs text-white/30 shrink-0">
                        ชม.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live total */}
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                  <span className="text-xs text-blue-400">รวมทั้งหมด</span>
                  <span className="text-sm font-bold text-blue-400">
                    {formatHours(totalEdited)}
                  </span>
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white/40">
                    หมายเหตุ (ไม่จำเป็น)
                  </label>
                  <textarea
                    value={overrideNote}
                    onChange={(e) => setOverrideNote(e.target.value)}
                    rows={2}
                    placeholder="เหตุผลที่แก้ไข เช่น ลืมเชคเอ้าท์"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-white/20 placeholder:text-white/20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                    onClick={handleSaveEdit}
                    disabled={isPending || !normalHours}
                  >
                    {isPending ? (
                      <Loader size={14} className="animate-spin" />
                    ) : (
                      "บันทึก"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/10 text-white/60 hover:bg-white/5 text-sm"
                    onClick={() => setShowEdit(false)}
                    disabled={isPending}
                  >
                    ยกเลิก
                  </Button>
                </div>
              </div>
            )}

            {/* Check-in/out */}
            {checkIn && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white/40 mb-3">
                  <Clock size={14} />
                  <span className="text-xs font-bold uppercase">เวลาทำงาน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">เข้างาน</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(checkIn.checkInTime).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">ออกงาน</span>
                  <span className="text-sm font-medium text-white">
                    {checkIn.checkOutTime
                      ? new Date(checkIn.checkOutTime).toLocaleTimeString(
                          "th-TH",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          },
                        )
                      : "กำลังทำงาน"}
                  </span>
                </div>
              </div>
            )}

            {attendance.workDescription && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-white/40">
                  รายละเอียดงาน
                </p>
                <p className="text-sm text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">
                  {attendance.workDescription}
                </p>
              </div>
            )}

            {attendance.issues && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-white/40">
                  ปัญหา
                </p>
                <p className="text-sm text-white/70 bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                  {attendance.issues}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {(attendance.status === "SUBMITTED" ||
            attendance.status === "APPROVED") &&
            !showEdit && (
              <div className="p-5 border-t border-white/10 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={handleReject}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  ไม่อนุมัติ
                </Button>
                {attendance.status === "SUBMITTED" && (
                  <Button
                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    อนุมัติ
                  </Button>
                )}
              </div>
            )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
