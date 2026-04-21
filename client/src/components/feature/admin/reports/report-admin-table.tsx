"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  ZoomIn,
} from "lucide-react";
import { approveReport, rejectReport } from "@/lib/actions/admin/report.action";
import { useRouter } from "next/navigation";
import type { ReportWithAttendance } from "@/lib/api/report/report.type";
import { toDateKey } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const availableDates = Array.from(
    new Set(reports.map((r) => toDateKey(r.attendance.workDate))),
  ).sort((a, b) => b.localeCompare(a));

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const selectedDateKey = availableDates[selectedDateIndex];
  const dayReports = reports.filter(
    (r) => toDateKey(r.attendance.workDate) === selectedDateKey,
  );
  const pendingCount = dayReports.filter((r) => r.status === "PENDING").length;

  const selectedDateLabel =
    selectedDateKey && dayReports[0]
      ? new Date(dayReports[0].attendance.workDate).toLocaleDateString(
          "th-TH",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        )
      : "-";

  const groupedBySite = dayReports.reduce<
    Record<string, { siteName: string; reports: ReportWithAttendance[] }>
  >((acc, r) => {
    const siteId = r.attendance.site.id;
    if (!acc[siteId])
      acc[siteId] = { siteName: r.attendance.site.name, reports: [] };
    acc[siteId].reports.push(r);
    return acc;
  }, {});
  const siteGroups = Object.values(groupedBySite);

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
      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative w-full max-w-2xl aspect-video">
            <Image
              src={lightboxImage}
              alt="full"
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 bg-white/10 text-white rounded-full p-2.5"
            onClick={() => setLightboxImage(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-white/10 shrink-0">
              <div>
                <p className="text-white font-semibold">
                  {selectedReport.attendance.employee?.firstName}{" "}
                  {selectedReport.attendance.employee?.lastName}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {selectedReport.attendance.site.name} — {selectedDateLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-medium shrink-0 ${statusColor[selectedReport.status]}`}
                >
                  {statusLabel[selectedReport.status]}
                </span>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-white/10 text-white rounded-full p-1.5 hover:bg-white/20"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Detail */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-1">รายละเอียด</p>
                <p className="text-sm text-white/80">{selectedReport.detail}</p>
              </div>

              {/* Images */}
              {selectedReport.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-white/40">
                    รูปภาพ ({selectedReport.images.length} รูป)
                  </p>
                  <div
                    className={cn(
                      "grid gap-2",
                      selectedReport.images.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2",
                    )}
                  >
                    {selectedReport.images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setLightboxImage(img.imageUrl)}
                        className={cn(
                          "relative rounded-xl overflow-hidden bg-white/10 group",
                          selectedReport.images.length === 1
                            ? "aspect-video"
                            : "aspect-square",
                        )}
                      >
                        <Image
                          src={img.imageUrl}
                          alt={`img-${i}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <ZoomIn
                            size={20}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedReport.status === "PENDING" && (
                <div className="flex gap-3">
                  <button
                    className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={isPending}
                    onClick={() => {
                      handleApprove(selectedReport.id);
                      setSelectedReport(null);
                    }}
                  >
                    <CheckCircle2 size={15} /> อนุมัติ
                  </button>
                  <button
                    className="flex-1 h-10 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={isPending}
                    onClick={() => {
                      handleReject(selectedReport.id);
                      setSelectedReport(null);
                    }}
                  >
                    <XCircle size={15} /> ไม่อนุมัติ
                  </button>
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
            {dayReports.length} รายงาน • {siteGroups.length} ไซต์งาน
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

      {/* Grouped by site */}
      {siteGroups.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-sm text-white/40">ไม่มีรายงานในวันนี้</p>
        </div>
      ) : (
        <div className="space-y-4">
          {siteGroups.map(({ siteName, reports: siteReports }) => {
            const sitePending = siteReports.filter(
              (r) => r.status === "PENDING",
            ).length;
            return (
              <div
                key={siteName}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-white/40" />
                    <p className="text-sm font-semibold text-white">
                      {siteName}
                    </p>
                    <span className="text-xs text-white/30">
                      {siteReports.length} รายงาน
                    </span>
                  </div>
                  {sitePending > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                      รอตรวจสอบ {sitePending}
                    </span>
                  )}
                </div>

                <div className="divide-y divide-white/5">
                  {siteReports.map((report) => {
                    const firstImage = report.images[0];
                    return (
                      <button
                        key={report.id}
                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 shrink-0">
                          {firstImage ? (
                            <Image
                              src={firstImage.imageUrl}
                              alt="report"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                              ไม่มีรูป
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">
                            {report.attendance.employee?.firstName}{" "}
                            {report.attendance.employee?.lastName}
                          </p>
                          <p className="text-xs text-white/40 truncate mt-0.5">
                            {report.detail}
                          </p>
                          {report.images.length > 1 && (
                            <p className="text-[10px] text-white/25 mt-0.5">
                              📷 {report.images.length} รูป
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusColor[report.status]}`}
                        >
                          {statusLabel[report.status]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
