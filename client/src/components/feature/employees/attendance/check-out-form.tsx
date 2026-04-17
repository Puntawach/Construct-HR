"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { checkOutAction } from "@/lib/actions/employee/attendance.action";
import type { Attendance } from "@/lib/types";

type Props = {
  attendance: Attendance;
};

export default function CheckOutForm({ attendance }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [workDescription, setWorkDescription] = useState("");
  const [issues, setIssues] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const checkInTime = attendance.checkIns?.[0]?.checkInTime
    ? new Date(attendance.checkIns[0].checkInTime)
    : null;

  const elapsedHours = checkInTime
    ? (currentTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    : 0;

  const elapsedLabel = checkInTime
    ? `${Math.floor(elapsedHours)}ชม. ${Math.floor((elapsedHours % 1) * 60)}น.`
    : "-";

  const checkInLabel = checkInTime
    ? checkInTime.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "-";

  const dateLabel = currentTime.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeLabel = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  function handleSubmit() {
    setError(null);

    startTransition(async () => {
      const result = await checkOutAction(
        attendance.id,
        new Date().toISOString(),
        workDescription.trim() || undefined,
        issues.trim() || undefined,
      );

      if (result.success) {
        router.push("/attendance");
      } else {
        setError(result.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">ออกงาน</h1>
          <p className="text-xs text-muted-foreground">Check-out</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Clock card */}
      <Card className="text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Clock size={16} />
            <span className="text-sm">{dateLabel}</span>
          </div>
          <p className="text-5xl font-bold tracking-tight font-mono">
            {timeLabel}
          </p>
          <p className="text-xs text-muted-foreground mt-2">เวลาปัจจุบัน</p>
        </CardContent>
      </Card>

      {/* Work summary card */}
      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="pt-4 pb-4 px-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">เวลาเข้างาน</span>
            <span className="font-semibold text-blue-700">{checkInLabel}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">ระยะเวลาทำงาน</span>
            <span className="font-semibold text-blue-700">{elapsedLabel}</span>
          </div>
          {elapsedHours > 8 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              <AlertTriangle size={13} />
              <span>OT {(elapsedHours - 8).toFixed(1)} ชม. จะถูกบันทึกแยก</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText size={15} className="text-muted-foreground" />
            สรุปงานวันนี้
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              งานที่ทำ <span className="text-xs">(ไม่บังคับ)</span>
            </Label>
            <Textarea
              placeholder="เช่น เทคอนกรีตชั้น 3, ติดตั้งนั่งร้าน..."
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              ปัญหาที่พบ <span className="text-xs">(ไม่บังคับ)</span>
            </Label>
            <Textarea
              placeholder="เช่น วัสดุไม่เพียงพอ, อุปกรณ์ชำรุด..."
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              disabled={isPending}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirm button */}
      <Button
        size="lg"
        className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white text-base h-14"
        disabled={isPending}
        onClick={handleSubmit}
      >
        {isPending ? (
          <>
            <span className="animate-spin">⏳</span> กำลังบันทึก...
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            ยืนยันออกงาน
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        หลังออกงาน ข้อมูลจะถูกส่งให้ Admin ตรวจสอบและอนุมัติ
      </p>
    </div>
  );
}
