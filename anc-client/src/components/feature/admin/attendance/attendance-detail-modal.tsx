// components/features/attendance/attendance-detail-modal.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { approve, reject } from "@/lib/actions/admin/attendance.action";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Loader, X, XCircle } from "lucide-react";
import { useTransition } from "react";

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

export default function AttendanceDetailModal({
  attendance,
  onClose,
  onAction,
}: Props) {
  const [isPending, startTransition] = useTransition();

  if (!attendance) return null;

  const initials =
    `${attendance.employee.firstName[0]}${attendance.employee.lastName[0]}`.toUpperCase();

  const checkIn = attendance.checkIns[0];

  // attendance-detail-modal.tsx
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
                Attendance Review
              </h3>
              <p className="text-sm text-white/40 mt-0.5">
                {new Date(attendance.workDate).toLocaleDateString("en-US", {
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
                  {attendance.status}
                </span>
              </div>
            </div>

            {/* Hours breakdown */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Total Hours",
                  value: `${attendance.totalHours.toFixed(1)}h`,
                },
                {
                  label: "Normal",
                  value: `${attendance.normalHours.toFixed(1)}h`,
                },
                {
                  label: "Overtime",
                  value: `${attendance.otHours.toFixed(1)}h`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 rounded-xl p-3 border border-white/10 text-center"
                >
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Check-in/out time */}
            {checkIn && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white/40 mb-3">
                  <Clock size={14} />
                  <span className="text-xs font-bold uppercase">
                    Work Session
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">Check In</span>
                  <span className="text-sm font-medium text-white">
                    {new Date(checkIn.checkInTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">Check Out</span>
                  <span className="text-sm font-medium text-white">
                    {checkIn.checkOutTime
                      ? new Date(checkIn.checkOutTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "Active"}
                  </span>
                </div>
              </div>
            )}

            {/* Work description */}
            {attendance.workDescription && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-white/40">
                  Work Description
                </p>
                <p className="text-sm text-white/70 bg-white/5 rounded-xl p-3 border border-white/10">
                  {attendance.workDescription}
                </p>
              </div>
            )}

            {/* Issues */}
            {attendance.issues && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-white/40">
                  Issues
                </p>
                <p className="text-sm text-white/70 bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                  {attendance.issues}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {/* Footer */}
          {(attendance.status === "SUBMITTED" ||
            attendance.status === "APPROVED") && (
            <div className="p-5 border-t border-white/10 flex gap-3">
              {/* Reject */}
              <Button
                variant="outline"
                className="flex-1 gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => {
                  handleReject(); // ← ต้องเป็น handleReject ไม่ใช่ handleApprove
                }}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Reject
              </Button>

              {/* Approve */}
              {attendance.status === "SUBMITTED" && (
                <Button
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApprove();
                  }}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Approve
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
