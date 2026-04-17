"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { checkInAction } from "@/lib/actions/employee/attendance.action";
import type { Site, Attendance } from "@/lib/types";

type Props = {
  sites: Site[];
  todayAttendance: Attendance | null;
};

export default function CheckInForm({ sites, todayAttendance }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedSite, setSelectedSite] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isAlreadyCheckedIn = todayAttendance !== null;
  const canSubmit = !isAlreadyCheckedIn && !!selectedSite && !isPending;

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
    if (!canSubmit) return;
    setError(null);

    startTransition(async () => {
      const result = await checkInAction(
        selectedSite,
        new Date().toISOString(), // checkInTime เท่านั้น
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
      <div className="flex items-center gap-3">
        <Link href="/attendance">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">เข้างาน</h1>
          <p className="text-xs text-muted-foreground">Check-in</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isAlreadyCheckedIn && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            คุณได้เข้างานแล้ววันนี้ ไม่สามารถเข้างานซ้ำได้
          </AlertDescription>
        </Alert>
      )}

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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin size={15} className="text-muted-foreground" />
            เลือกไซต์งาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedSite}
            onValueChange={setSelectedSite}
            disabled={isAlreadyCheckedIn || isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกไซต์งาน..." />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">วันทำงาน</span>
            <span className="font-medium">
              {currentTime.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white text-base h-14"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isPending ? (
          <>
            <span className="animate-spin">⏳</span> กำลังบันทึก...
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            ยืนยันเข้างาน
          </>
        )}
      </Button>

      {!selectedSite && !isAlreadyCheckedIn && (
        <p className="text-center text-xs text-muted-foreground">
          กรุณาเลือกไซต์งานก่อนกดยืนยัน
        </p>
      )}
    </div>
  );
}
