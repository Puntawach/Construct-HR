'use client'

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, AlertCircle, CheckCircle2, Loader, Navigation } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkInAction } from "@/lib/actions/employee/attendance.action"
import type { Site, Attendance } from "@/lib/types"
import { cn } from "@/lib/utils"

type Props = {
  sites: Site[]
  todayAttendance: Attendance | null
}

const MAX_DISTANCE_KM = 2

// Haversine formula — คำนวณระยะห่างระหว่าง 2 coordinates (km)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "granted"; lat: number; lng: number }
  | { status: "denied"; message: string }

export default function CheckInForm({ sites, todayAttendance }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<LocationState>({ status: "idle" })

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // ขอ location อัตโนมัติตอน mount
  useEffect(() => {
    if (todayAttendance) return
    requestLocation()
  }, [])

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocation({ status: "denied", message: "อุปกรณ์ไม่รองรับ GPS" })
      return
    }

    setLocation({ status: "loading" })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      (err) => {
        const msg =
          err.code === 1 ? "กรุณาอนุญาตการเข้าถึง GPS" :
          err.code === 2 ? "ไม่สามารถระบุตำแหน่งได้" :
          "หมดเวลาขอตำแหน่ง"
        setLocation({ status: "denied", message: msg })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const isAlreadyCheckedIn = todayAttendance !== null

  // ตรวจสอบระยะห่างจาก site ที่เลือก
  const selectedSiteData = sites.find((s) => s.id === selectedSite)
  const distanceKm =
    location.status === "granted" && selectedSiteData
      ? getDistanceKm(location.lat, location.lng, selectedSiteData.lat, selectedSiteData.long)
      : null

  const isTooFar = distanceKm !== null && distanceKm > MAX_DISTANCE_KM
  const canSubmit =
    !isAlreadyCheckedIn &&
    !!selectedSite &&
    !isPending &&
    location.status === "granted" &&
    !isTooFar

  const timeLabel = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  })

  const dateLabel = currentTime.toLocaleDateString("th-TH", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  function handleSubmit() {
    if (!canSubmit) return
    setError(null)
    startTransition(async () => {
      const result = await checkInAction(selectedSite, new Date().toISOString())
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
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">เข้างาน</h1>
          <p className="text-xs text-gray-400">Check-in</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-2xl px-4 py-3 text-sm">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Already checked in */}
      {isAlreadyCheckedIn && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 rounded-2xl px-4 py-3 text-sm">
          <AlertCircle size={15} />
          <span>คุณได้เข้างานแล้ววันนี้</span>
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

      {/* GPS Status */}
      {!isAlreadyCheckedIn && (
        <div className={cn(
          "rounded-2xl px-4 py-3.5 flex items-center justify-between",
          location.status === "granted" ? "bg-green-50" :
          location.status === "denied" ? "bg-red-50" :
          "bg-gray-50"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center",
              location.status === "granted" ? "bg-green-100" :
              location.status === "denied" ? "bg-red-100" :
              "bg-gray-100"
            )}>
              {location.status === "loading" ? (
                <Loader size={15} className="text-gray-400 animate-spin" />
              ) : (
                <Navigation size={15} className={cn(
                  location.status === "granted" ? "text-green-600" :
                  location.status === "denied" ? "text-red-500" :
                  "text-gray-400"
                )} />
              )}
            </div>
            <div>
              <p className={cn(
                "text-sm font-semibold",
                location.status === "granted" ? "text-green-700" :
                location.status === "denied" ? "text-red-600" :
                location.status === "loading" ? "text-gray-500" :
                "text-gray-600"
              )}>
                {location.status === "idle" && "รอตรวจสอบตำแหน่ง"}
                {location.status === "loading" && "กำลังระบุตำแหน่ง..."}
                {location.status === "granted" && "ระบุตำแหน่งแล้ว"}
                {location.status === "denied" && "ไม่สามารถระบุตำแหน่งได้"}
              </p>
              {location.status === "denied" && (
                <p className="text-xs text-red-400 mt-0.5">{location.message}</p>
              )}
            </div>
          </div>

          {location.status === "denied" && (
            <button
              onClick={requestLocation}
              className="text-xs text-red-500 font-semibold bg-red-100 px-3 py-1.5 rounded-xl"
            >
              ลองใหม่
            </button>
          )}
        </div>
      )}

      {/* Site selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">เลือกไซต์งาน</p>
        </div>
        <Select
          value={selectedSite}
          onValueChange={setSelectedSite}
          disabled={isAlreadyCheckedIn || isPending}
        >
          <SelectTrigger className="w-full bg-gray-50 border-gray-100 rounded-xl">
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

        {/* Distance indicator */}
        {distanceKm !== null && (
          <div className={cn(
            "flex items-center justify-between rounded-xl px-4 py-3",
            isTooFar ? "bg-red-50" : "bg-green-50"
          )}>
            <div className="flex items-center gap-2">
              <Navigation size={13} className={isTooFar ? "text-red-500" : "text-green-600"} />
              <p className={cn(
                "text-sm font-semibold",
                isTooFar ? "text-red-600" : "text-green-700"
              )}>
                {isTooFar ? "อยู่ไกลเกินไป" : "อยู่ในระยะ"}
              </p>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-sm font-bold",
                isTooFar ? "text-red-600" : "text-green-700"
              )}>
                {distanceKm < 1
                  ? `${Math.round(distanceKm * 1000)} ม.`
                  : `${distanceKm.toFixed(1)} กม.`}
              </p>
              <p className="text-[10px] text-gray-400">จากไซต์งาน (max {MAX_DISTANCE_KM} กม.)</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm pt-1">
          <span className="text-gray-400">วันทำงาน</span>
          <span className="font-medium text-gray-700">
            {currentTime.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        className="w-full h-14 rounded-2xl bg-blue-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isPending ? (
          <><Loader size={18} className="animate-spin" /> กำลังบันทึก...</>
        ) : isTooFar ? (
          <><AlertCircle size={18} /> อยู่ไกลเกินระยะที่กำหนด</>
        ) : location.status !== "granted" ? (
          <><Navigation size={18} /> รอระบุตำแหน่ง...</>
        ) : (
          <><CheckCircle2 size={18} /> ยืนยันเข้างาน</>
        )}
      </button>

      {!selectedSite && !isAlreadyCheckedIn && (
        <p className="text-center text-xs text-gray-400">กรุณาเลือกไซต์งานก่อนกดยืนยัน</p>
      )}
    </div>
  )
}