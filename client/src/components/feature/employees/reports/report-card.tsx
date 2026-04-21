import { Card, CardContent } from "@/components/ui/card";
import { ReportWithAttendance } from "@/lib/api/report/report.type";
import { CalendarDays, MapPin, FileText } from "lucide-react";
import Image from "next/image";

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

type Props = {
  report: ReportWithAttendance;
};

export default function ReportCard({ report }: Props) {
  const workDate = new Date(report.attendance.workDate).toLocaleDateString(
    "th-TH",
    { weekday: "short", day: "numeric", month: "short", year: "numeric" },
  );

  const firstImage = report.images[0];

  return (
    <Card className="border border-gray-100 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-3 p-4">
          {/* Thumbnail */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
            {firstImage ? (
              <>
                <Image
                  src={firstImage.imageUrl}
                  alt="report"
                  fill
                  className="object-cover"
                />
                {report.images.length > 1 && (
                  <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-lg">
                    +{report.images.length - 1}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText size={20} className="text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                {report.detail}
              </p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusColor[report.status]}`}
              >
                {statusLabel[report.status] ?? report.status}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <CalendarDays size={11} />
                <span>{workDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={11} />
                <span className="truncate">{report.attendance.site.name}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
