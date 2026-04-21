"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createReportAction } from "@/lib/actions/employee/report.action";
import type { Attendance } from "@/lib/types";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  X,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/utils/date";

type Props = {
  attendances: Attendance[];
  open: boolean;
  onClose: () => void;
};

const statusColor: Record<string, string> = {
  WORKING: "bg-blue-500",
  SUBMITTED: "bg-amber-400",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export default function ReportForm({ attendances, open, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAttendanceId, setSelectedAttendanceId] = useState("");
  const [detail, setDetail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth =
    month === today.getMonth() && year === today.getFullYear();

  const attendanceMap = new Map<string, Attendance>();
  attendances.forEach((a) => attendanceMap.set(toDateKey(a.workDate), a));

  const selectedAttendance =
    attendances.find((a) => a.id === selectedAttendanceId) ?? null;
  const selectedDateKey = selectedAttendance
    ? toDateKey(selectedAttendance.workDate)
    : null;

  const monthLabel = new Date(year, month, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  const canSubmit =
    !!selectedAttendanceId && !!detail.trim() && files.length > 0 && !isPending;

  const handleClose = useCallback(() => {
    setSelectedAttendanceId("");
    setDetail("");
    setFiles([]);
    setPreviews([]);
    setError(null);
    onClose();
  }, [onClose]);

  function handleDayClick(day: number) {
    const dateKey = `${year}-${month + 1}-${day}`;
    const att = attendanceMap.get(dateKey);
    if (att) setSelectedAttendanceId(att.id);
  }

  // report-form.tsx — เพิ่ม validation ก่อน submit
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    // จำกัดขนาดแต่ละไฟล์ไม่เกิน 2MB
    const oversized = selected.filter((f) => f.size > 2 * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`รูปบางรูปใหญ่เกิน 2MB กรุณาเลือกใหม่`);
      return;
    }

    // จำนวนรูปรวมต้องไม่เกิน 5 รูป
    if (files.length + selected.length > 5) {
      setError(`อัพโหลดได้สูงสุด 5 รูปต่อรายงาน`);
      return;
    }

    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    startTransition(async () => {
      const result = await createReportAction(
        selectedAttendanceId,
        detail,
        files,
      );
      if (result.success) {
        router.refresh();
        handleClose();
      } else {
        setError(result.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={handleClose}
        />
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl transition-transform duration-300 ease-out flex flex-col max-h-[92vh] md:max-w-md md:left-1/2 md:-translate-x-1/2",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">ส่งรายงาน</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5 pb-28">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Calendar picker */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              เลือกวันที่ทำงาน
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-500" />
              </button>
              <p className="text-sm font-semibold text-gray-800">
                {monthLabel}
              </p>
              <button
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                disabled={isCurrentMonth}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30"
              >
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-7">
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
                <div
                  key={d}
                  className={cn(
                    "text-center text-[10px] font-semibold py-1",
                    i === 0 || i === 6 ? "text-red-300" : "text-gray-400",
                  )}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {blanks.map((_, i) => (
                <div key={`b-${i}`} />
              ))}
              {days.map((day) => {
                const dateKey = `${year}-${month + 1}-${day}`;
                const att = attendanceMap.get(dateKey);
                const isSelected = selectedDateKey === dateKey;
                const isToday = dateKey === toDateKey(today);
                const isFuture = new Date(year, month, day) > today;
                const dow = new Date(year, month, day).getDay();
                const isWeekend = dow === 0 || dow === 6;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    disabled={!att || isFuture}
                    className={cn(
                      "flex flex-col items-center justify-center py-1.5 rounded-xl transition-all",
                      isSelected && "bg-gray-900",
                      !isSelected && att && "hover:bg-gray-100 active:scale-95",
                      !isSelected && isToday && "bg-blue-50",
                      (!att || isFuture) && "opacity-30 cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isSelected
                          ? "text-white"
                          : isToday
                            ? "text-blue-600 font-bold"
                            : isWeekend
                              ? "text-red-300"
                              : "text-gray-600",
                      )}
                    >
                      {day}
                    </span>
                    {att && (
                      <div
                        className={cn(
                          "w-1 h-1 rounded-full mt-0.5",
                          isSelected ? "bg-white" : statusColor[att.status],
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedAttendance && (
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-700">
                  {new Date(selectedAttendance.workDate).toLocaleDateString(
                    "th-TH",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    },
                  )}
                </p>
                {selectedAttendance.site?.name && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedAttendance.site.name}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              รายละเอียด
            </p>
            <Textarea
              placeholder="อธิบายงานที่ทำในวันนั้น..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              disabled={isPending}
              rows={3}
              className="bg-gray-50 border-gray-100 rounded-xl resize-none"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              รูปภาพ ({previews.length}/10)
            </p>

            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={src}
                      alt={`preview-${i}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFile(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {previews.length < 10 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-400 active:scale-95 transition-all"
                  >
                    <Plus size={18} />
                    <span className="text-[10px]">เพิ่มรูป</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 active:scale-95 transition-all"
              >
                <ImagePlus size={22} />
                <span className="text-xs">
                  แตะเพื่อเลือกรูปภาพ (สูงสุด 10 รูป)
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit */}
          <button
            className="w-full h-12 rounded-xl bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isPending ? (
              <span>กำลังส่ง...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                ส่งรายงาน
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
