"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Search,
  ChevronDown,
  CalendarDays,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import type { ReportWithAttendance } from "@/lib/api/report/report.type";
import type { ReportStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

type StatusFilter = ReportStatus | "ALL";
const PAGE_SIZE = 8;

type Props = {
  reports: ReportWithAttendance[];
};

export default function ReportList({ reports }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "ทั้งหมด", value: "ALL" },
    { label: "รอตรวจสอบ", value: "PENDING" },
    { label: "อนุมัติแล้ว", value: "APPROVED" },
    { label: "ไม่อนุมัติ", value: "REJECTED" },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports.filter((r) => {
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      const matchSearch =
        !q ||
        r.detail.toLowerCase().includes(q) ||
        r.attendance.site.name.toLowerCase().includes(q) ||
        new Date(r.attendance.workDate)
          .toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          .includes(q);
      return matchStatus && matchSearch;
    });
  }, [reports, search, statusFilter]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <>
      {/* Image preview modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden">
            <Image
              src={selectedImage}
              alt="report"
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 bg-white/10 text-white rounded-full p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="ค้นหารายละเอียด, ไซต์งาน..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-white border-gray-200 text-sm"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={cn(
                "shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors",
                statusFilter === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
              )}
            >
              {f.label}
              <span className="ml-1 opacity-60">
                (
                {f.value === "ALL"
                  ? reports.length
                  : reports.filter((r) => r.status === f.value).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground">
          พบ {filtered.length} รายการ
          {search && ` สำหรับ "${search}"`}
        </p>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-10 space-y-2 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <FileText size={18} className="text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">ไม่พบรายการที่ค้นหา</p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {visible.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <button
                    onClick={() => setSelectedImage(report.imageUrl)}
                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={report.imageUrl}
                      alt="report"
                      fill
                      className="object-cover"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
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
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 min-w-0">
                        <MapPin size={10} className="shrink-0" />
                        <span className="truncate">
                          {report.attendance.site.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusColor[report.status]}`}
                  >
                    {statusLabel[report.status]}
                  </span>
                </div>
              ))}
            </div>

            {hasMore && (
              <Button
                variant="outline"
                className="w-full gap-2 text-sm text-gray-500 border-gray-200"
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronDown size={15} />
                โหลดเพิ่ม ({filtered.length - visible.length} รายการ)
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
