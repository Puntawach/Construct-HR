"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createReportAction } from "@/lib/actions/employee/report.action";
import type { Attendance } from "@/lib/types";
import { AlertCircle, Camera, CheckCircle2, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  attendances: Attendance[];
};

export default function ReportForm({ attendances }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit =
    !!selectedAttendance && !!detail.trim() && !!file && !isPending;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleRemoveFile() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setError(null);

    startTransition(async () => {
      const result = await createReportAction(
        selectedAttendance,
        detail,
        file!,
      );

      if (result.success) {
        setSuccess(true);
        setSelectedAttendance("");
        setDetail("");
        setFile(null);
        setPreview(null);
        router.refresh();
      } else {
        setError(result.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  }

  return (
    <Card className="border border-blue-100 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Camera size={15} className="text-blue-600" />
          ส่งรายงานใหม่
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              ส่งรายงานสำเร็จแล้ว
            </AlertDescription>
          </Alert>
        )}

        {/* Select attendance */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">วันที่ทำงาน</Label>
          <Select
            value={selectedAttendance}
            onValueChange={setSelectedAttendance}
            disabled={isPending}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="เลือกวันที่ทำงาน..." />
            </SelectTrigger>
            <SelectContent>
              {attendances.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {new Date(a.workDate).toLocaleDateString("th-TH", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {a.site?.name ? ` — ${a.site.name}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Detail */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">รายละเอียด</Label>
          <Textarea
            placeholder="อธิบายงานที่ทำในวันนั้น..."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            disabled={isPending}
            rows={3}
            className="bg-white"
          />
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">รูปภาพ</Label>
          {preview ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover"
              />
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
            >
              <ImagePlus size={24} />
              <span className="text-xs">แตะเพื่อเลือกรูปภาพ</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <Button
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white h-11"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {isPending ? (
            <>
              <span className="animate-spin">⏳</span> กำลังส่ง...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> ส่งรายงาน
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
