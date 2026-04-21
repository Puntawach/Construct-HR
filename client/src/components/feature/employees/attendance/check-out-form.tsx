'use client'

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, AlertCircle, CheckCircle2, FileText, AlertTriangle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { checkOutAction } from "@/lib/actions/employee/attendance.action"
import type { Attendance } from "@/lib/types"

type Props = {
  attendance: Attendance
}

export default function CheckOutForm({ attendance }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [workDescription, setWorkDescription] = useState("")
  const [issues, setIssues] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const checkInTime = attendance.checkIns?.[0]?.checkInTime
    ? new Date(attendance.checkIns[0].checkInTime)
    : null

  const elapsedHours = checkInTime
    ? (currentTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
    : 0

  const elapsedLabel = checkInTime
    ? `${Math.floor(elapsedHours)}ชม. ${Math.floor((elapsedHours % 1) * 60)}น.`
    : "-"

  const checkInLabel = checkInTime
    ? checkInTime.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "-"

  const timeLabel = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  })

  const dateLabel = currentTime.toLocaleDateString("th-TH", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await checkOutAction(
        attendance.id,
        new Date().toISOString(),
        workDescription.trim() || undefined,
        issues.trim() || undefined,
      )
      if (result.success) router.push("/attendance")
      else setError(result.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่")
    })
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/attendance" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">ออกงาน</h1>
          <p className="text-xs text-gray-400">Check-out</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-2xl px-4 py-3 text-sm">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Clock */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-8 text-center">
        <p className="text-xs text-gray-400 mb-3 flex items-center justify-center gap-1.5">
          <Clock size={12} />{dateLabel}
        </p>
        <p className="text-5xl font-black text-gray-900 tracking-tighter font-mono">
          {timeLabel}
        </p>
      </div>

      {/* Work summary */}
      <div className="bg-blue-50 rounded-2xl p-5 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-400">เวลาเข้างาน</span>
          <span className="font-bold text-blue-700 font-mono">{checkInLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-400">ระยะเวลาทำงาน</span>
          <span className="font-bold text-blue-700">{elapsedLabel}</span>
        </div>
        {elapsedHours > 8 && (
          <div className="flex items-center gap-2 text-xs text-amber-600 pt-1 border-t border-blue-100">
            <AlertTriangle size={12} />
            <span>OT {(elapsedHours - 8).toFixed(1)} ชม. จะถูกบันทึกแยก</span>
          </div>
        )}
      </div>

      {/* Work description */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">สรุปงานวันนี้</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">งานที่ทำ <span>(ไม่บังคับ)</span></p>
          <Textarea
            placeholder="เช่น เทคอนกรีตชั้น 3, ติดตั้งนั่งร้าน..."
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            disabled={isPending}
            rows={3}
            className="bg-gray-50 border-gray-100 rounded-xl resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">ปัญหาที่พบ <span>(ไม่บังคับ)</span></p>
          <Textarea
            placeholder="เช่น วัสดุไม่เพียงพอ, อุปกรณ์ชำรุด..."
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            disabled={isPending}
            rows={3}
            className="bg-gray-50 border-gray-100 rounded-xl resize-none"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100"
        disabled={isPending}
        onClick={handleSubmit}
      >
        {isPending ? (
          <span className="text-sm">กำลังบันทึก...</span>
        ) : (
          <>
            <CheckCircle2 size={20} />
            ยืนยันออกงาน
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        หลังออกงาน ข้อมูลจะถูกส่งให้ Admin ตรวจสอบและอนุมัติ
      </p>
    </div>
  )
}