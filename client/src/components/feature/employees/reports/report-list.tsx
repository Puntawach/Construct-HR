"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  CalendarDays,
  MapPin,
  X,
  Clock,
  ChevronRight,
  Camera,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import type { ReportWithAttendance } from "@/lib/api/report/report.type";
import type { Attendance } from "@/lib/types";
import { cn } from "@/lib/utils";
import ReportForm from "./report-form";

const statusLabel: Record<string, string> = {
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  APPROVED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-600",
};

const statusDot: Record<string, string> = {
  PENDING: "bg-amber-400",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

type Props = {
  reports: ReportWithAttendance[];
  attendances: Attendance[];
};

export default function ReportList({ reports, attendances }: Props) {
  const [selectedReport, setSelectedReport] =
    useState<ReportWithAttendance | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, ReportWithAttendance[]>();
    reports.forEach((r) => {
      const date = new Date(r.attendance.workDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, items]) => {
        const [year, month] = key.split("-").map(Number);
        const label = new Date(year, month, 1).toLocaleDateString("th-TH", {
          month: "long",
          year: "numeric",
        });
        return { key, label, items };
      });
  }, [reports]);

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <>
      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative w-full max-w-lg aspect-video">
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
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] bg-white rounded-3xl overflow-hidden md:max-w-sm md:left-1/2 md:-translate-x-1/2 md:inset-x-auto max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                  รายงานประจำวัน
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {new Date(
                    selectedReport.attendance.workDate,
                  ).toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <button
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0"
                onClick={() => setSelectedReport(null)}
              >
                <X size={15} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Status + Site */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs px-3 py-1 rounded-full font-semibold",
                    statusColor[selectedReport.status],
                  )}
                >
                  {statusLabel[selectedReport.status]}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={11} />
                  <span>{selectedReport.attendance.site.name}</span>
                </div>
              </div>

              {/* Detail */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2">
                  รายละเอียดงาน
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {selectedReport.detail}
                </p>
              </div>

              {/* Images grid */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
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
                        "relative rounded-xl overflow-hidden bg-gray-100 active:scale-95 transition-all group",
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
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn
                          size={20}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={11} />
                <span>
                  ส่งเมื่อ{" "}
                  {new Date(selectedReport.createdAt).toLocaleDateString(
                    "th-TH",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom sheet form */}
      <ReportForm
        attendances={attendances}
        open={showForm}
        onClose={() => setShowForm(false)}
      />

      <div className="space-y-5">
        {/* Header + Add button */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            ทั้งหมด {reports.length} รายการ
            {pendingCount > 0 && (
              <span className="ml-2 text-amber-500">
                • รอตรวจสอบ {pendingCount}
              </span>
            )}
          </p>
          {attendances.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 active:scale-95 transition-all"
            >
              <Camera size={15} />
              ส่งรายงาน
            </button>
          )}
        </div>

        {/* Empty state */}
        {reports.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto">
              <FileText size={24} className="text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">
                ยังไม่มีรายงาน
              </p>
              <p className="text-xs text-gray-400 mt-1">
                กดส่งรายงานเพื่อเริ่มบันทึก
              </p>
            </div>
            {attendances.length > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl"
              >
                <Camera size={15} />
                ส่งรายงานแรก
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ key, label, items }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{items.length} รายการ</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 overflow-hidden divide-y divide-gray-50">
                  {items.map((report) => {
                    const firstImage = report.images[0];
                    return (
                      <button
                        key={report.id}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                        onClick={() => setSelectedReport(report)}
                      >
                        {/* Thumbnail — รูปแรก */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {firstImage ? (
                            <Image
                              src={firstImage.imageUrl}
                              alt="report"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText size={16} className="text-gray-300" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white",
                              statusDot[report.status],
                            )}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {report.detail}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <CalendarDays size={10} />
                              <span>
                                {new Date(
                                  report.attendance.workDate,
                                ).toLocaleDateString("th-TH", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 min-w-0">
                              <MapPin size={10} className="shrink-0" />
                              <span className="truncate">
                                {report.attendance.site.name}
                              </span>
                            </div>
                            {report.images.length > 1 && (
                              <span className="text-xs text-gray-400 shrink-0">
                                📷 {report.images.length}
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight
                          size={14}
                          className="text-gray-300 shrink-0"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
