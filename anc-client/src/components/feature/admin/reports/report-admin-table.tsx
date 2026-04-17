"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveReport, rejectReport } from "@/lib/actions/admin/report.action";
import { useRouter } from "next/navigation";
import type { ReportWithAttendance } from "@/lib/api/report/report.type";
import { toDateKey } from "@/lib/utils/date";

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabel: Record<string, string> = {
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

type Props = {
  reports: ReportWithAttendance[];
};

export default function ReportAdminTable({ reports }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedReport, setSelectedReport] =
    useState<ReportWithAttendance | null>(null);

  // หา unique dates ที่มี report
  const availableDates = Array.from(
    new Set(reports.map((r) => toDateKey(r.attendance.workDate))),
  ).sort((a, b) => b.localeCompare(a));

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const selectedDateKey = availableDates[selectedDateIndex];

  const dayReports = reports.filter(
    (r) => toDateKey(r.attendance.workDate) === selectedDateKey,
  );

  const pendingCount = dayReports.filter((r) => r.status === "PENDING").length;

  const selectedDateLabel = selectedDateKey
    ? new Date(dayReports[0]?.attendance.workDate).toLocaleDateString("th-TH", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  function handleApprove(reportId: string) {
    startTransition(async () => {
      await approveReport(reportId);
      router.refresh();
    });
  }

  function handleReject(reportId: string) {
    startTransition(async () => {
      await rejectReport(reportId);
      router.refresh();
    });
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center space-y-2">
        <CheckCircle2 size={32} className="text-white/20 mx-auto" />
        <p className="text-sm text-white/40">ไม่มีรายงาน</p>
      </div>
    );
  }

  return (
    <>
      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-video bg-black">
              <Image
                src={selectedReport.imageUrl}
                alt="report"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-semibold">
                    {selectedReport.attendance.employee.firstName}{" "}
                    {selectedReport.attendance.employee.lastName}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {selectedDateLabel} — {selectedReport.attendance.site.name}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-medium shrink-0 ${statusColor[selectedReport.status]}`}
                >
                  {statusLabel[selectedReport.status]}
                </span>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-1">รายละเอียด</p>
                <p className="text-sm text-white/80">{selectedReport.detail}</p>
              </div>

              {selectedReport.status === "PENDING" && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                    disabled={isPending}
                    onClick={() => {
                      handleApprove(selectedReport.id);
                      setSelectedReport(null);
                    }}
                  >
                    <CheckCircle2 size={15} />
                    อนุมัติ
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
                    disabled={isPending}
                    onClick={() => {
                      handleReject(selectedReport.id);
                      setSelectedReport(null);
                    }}
                  >
                    <XCircle size={15} />
                    ไม่อนุมัติ
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date navigator */}
      <div className="flex items-center justify-between bg-white/5 rounded-xl border border-white/10 px-4 py-3">
        <button
          onClick={() =>
            setSelectedDateIndex((i) =>
              Math.min(i + 1, availableDates.length - 1),
            )
          }
          disabled={selectedDateIndex >= availableDates.length - 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} className="text-white" />
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-white">
            {selectedDateLabel}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {dayReports.length} รายงาน
            {pendingCount > 0 && (
              <span className="ml-2 text-amber-400">
                • รอตรวจสอบ {pendingCount} รายการ
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setSelectedDateIndex((i) => Math.max(i - 1, 0))}
          disabled={selectedDateIndex <= 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      </div>

      {/* Reports for selected date */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden divide-y divide-white/5">
        {dayReports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-white/40">ไม่มีรายงานในวันนี้</p>
          </div>
        ) : (
          dayReports.map((report) => (
            <button
              key={report.id}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
              onClick={() => setSelectedReport(report)}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
                <Image
                  src={report.imageUrl}
                  alt="report"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {report.attendance.employee.firstName}{" "}
                  {report.attendance.employee.lastName}
                </p>
                <p className="text-xs text-white/40 truncate mt-0.5">
                  {report.detail}
                </p>
                <p className="text-xs text-white/30 mt-1">
                  {report.attendance.site.name}
                </p>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusColor[report.status]}`}
              >
                {statusLabel[report.status]}
              </span>
            </button>
          ))
        )}
      </div>
    </>
  );
}
