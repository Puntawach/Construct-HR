"use client";

import { useState, useTransition, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import {
  createSiteAction,
  updateSiteAction,
  deleteSiteAction,
  getSiteAttendanceAction,
} from "@/lib/actions/admin/site.action";
import type { Site } from "@/lib/api/site/site.type";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ShiftEditor from "./shift-editor";

type Props = {
  sites: Site[];
  defaultMonth: string;
};
type FormState = { name: string; lat: string; long: string };

const statusColor: Record<string, string> = {
  WORKING: "bg-blue-500/10 text-blue-400",
  SUBMITTED: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-green-500/10 text-green-400",
  REJECTED: "bg-red-500/10 text-red-400",
};

const statusLabel: Record<string, string> = {
  WORKING: "กำลังทำงาน",
  SUBMITTED: "รอตรวจสอบ",
  APPROVED: "อนุมัติแล้ว",
  REJECTED: "ไม่อนุมัติ",
};

export default function SiteAdminTable({ sites, defaultMonth }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", lat: "", long: "" });
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [siteAttendances, setSiteAttendances] = useState<
    AttendanceWithEmployee[]
  >([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [monthFilter, setMonthFilter] = useState(defaultMonth);

  useEffect(() => {
    if (!selectedSite) return;
    const fetchData = async () => {
      setLoadingAttendance(true);
      const result = await getSiteAttendanceAction(selectedSite.id);
      setSiteAttendances(result.success ? (result.data ?? []) : []);
      setLoadingAttendance(false);
    };
    fetchData();
  }, [selectedSite]);

  function startEdit(site: Site) {
    setEditingId(site.id);
    setForm({
      name: site.name,
      lat: String(site.lat),
      long: String(site.long),
    });
    setShowCreate(false);
  }

  function handleCreate() {
    startTransition(async () => {
      await createSiteAction({
        name: form.name,
        lat: Number(form.lat),
        long: Number(form.long),
      });
      setShowCreate(false);
      setForm({ name: "", lat: "", long: "" });
      router.refresh();
    });
  }

  function handleUpdate(id: string) {
    startTransition(async () => {
      await updateSiteAction(id, {
        name: form.name,
        lat: Number(form.lat),
        long: Number(form.long),
      });
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSiteAction(id);
      if (selectedSite?.id === id) setSelectedSite(null);
      router.refresh();
    });
  }

  const [filterYear, filterMonth] = monthFilter.split("-").map(Number);
  const filteredAttendances = siteAttendances.filter((a) => {
    const d = new Date(a.workDate);
    return d.getFullYear() === filterYear && d.getMonth() + 1 === filterMonth;
  });

  const groupedByDate = filteredAttendances.reduce<
    Record<string, AttendanceWithEmployee[]>
  >((acc, a) => {
    const key = new Date(a.workDate).toISOString().split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
    b.localeCompare(a),
  );
  const totalDays = filteredAttendances.length;
  const totalHours = filteredAttendances.reduce(
    (sum, a) => sum + a.totalHours,
    0,
  );
  const uniqueEmployees = new Set(filteredAttendances.map((a) => a.employee.id))
    .size;

  const mapsUrl = selectedSite
    ? `https://www.google.com/maps?q=${selectedSite.lat},${selectedSite.long}`
    : "";

  return (
    <div className="flex gap-6">
      {/* Site list */}
      <div className="flex-1 space-y-4 min-w-0">
        <div className="flex justify-end">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            onClick={() => {
              setShowCreate(true);
              setEditingId(null);
            }}
          >
            <Plus size={16} />
            เพิ่มไซต์งาน
          </button>
        </div>

        {showCreate && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
            <p className="text-sm font-semibold text-white">เพิ่มไซต์งานใหม่</p>
            <div className="space-y-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ชื่อไซต์งาน"
                className="bg-white/5 border-white/10 text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  placeholder="Latitude เช่น 13.7563"
                  type="number"
                  className="bg-white/5 border-white/10 text-white"
                />
                <Input
                  value={form.long}
                  onChange={(e) => setForm({ ...form, long: e.target.value })}
                  placeholder="Longitude เช่น 100.5018"
                  type="number"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5"
                disabled={!form.name || !form.lat || !form.long || isPending}
                onClick={handleCreate}
              >
                <Check size={14} />
                บันทึก
              </button>
              <button
                className="px-3 py-1.5 border border-white/10 text-white/60 hover:bg-white/5 text-sm rounded-lg flex items-center gap-1.5"
                onClick={() => setShowCreate(false)}
              >
                <X size={14} />
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
          {sites.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <MapPin size={32} className="text-white/20 mx-auto" />
              <p className="text-sm text-white/40">ยังไม่มีไซต์งาน</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {sites.map((site) => (
                <div key={site.id}>
                  {editingId === site.id ? (
                    <div className="px-5 py-4 space-y-3">
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={form.lat}
                          onChange={(e) =>
                            setForm({ ...form, lat: e.target.value })
                          }
                          type="number"
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          value={form.long}
                          onChange={(e) =>
                            setForm({ ...form, long: e.target.value })
                          }
                          type="number"
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5"
                          disabled={isPending}
                          onClick={() => handleUpdate(site.id)}
                        >
                          <Check size={14} />
                          บันทึก
                        </button>
                        <button
                          className="px-3 py-1.5 border border-white/10 text-white/60 text-sm rounded-lg"
                          onClick={() => setEditingId(null)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ✅ เปลี่ยนเป็น div — ไม่มี button ซ้อน button
                    <div
                      className={cn(
                        "w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer",
                        selectedSite?.id === site.id &&
                          "bg-white/5 border-l-2 border-blue-500",
                      )}
                      onClick={() =>
                        setSelectedSite(
                          selectedSite?.id === site.id ? null : site,
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {site.name}
                          </p>
                          <p className="text-xs text-white/40 mt-0.5 font-mono">
                            {site.lat.toFixed(4)}, {site.long.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-white/10 text-white/60 hover:bg-white/10 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(site);
                          }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                          disabled={isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(site.id);
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                        <ChevronRight
                          size={14}
                          className={cn(
                            "text-white/20 transition-transform",
                            selectedSite?.id === site.id && "rotate-90",
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Site detail panel */}
      {selectedSite && (
        <div className="w-96 shrink-0 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-white">
                  {selectedSite.name}
                </h2>
                <p className="text-xs text-white/40 font-mono mt-0.5">
                  {selectedSite.lat.toFixed(6)}, {selectedSite.long.toFixed(6)}
                </p>
              </div>
              <button
                onClick={() => setSelectedSite(null)}
                className="w-7 h-7 flex items-center justify-center text-white/40 hover:bg-white/5 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg"
            >
              <ExternalLink size={12} />
              เปิดใน Google Maps
            </a>
          </div>
          {/* Shift settings */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              เวลาทำงาน
            </p>
            <ShiftEditor site={selectedSite} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "วันทำงาน",
                value: totalDays,
                icon: Calendar,
                color: "text-blue-400",
              },
              {
                label: "พนักงาน",
                value: uniqueEmployees,
                icon: Users,
                color: "text-purple-400",
              },
              {
                label: "ชั่วโมง",
                value: totalHours.toFixed(0),
                icon: Clock,
                color: "text-green-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
              >
                <s.icon size={14} className={cn("mx-auto mb-1.5", s.color)} />
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                ประวัติการทำงาน
              </p>
            </div>

            {loadingAttendance ? (
              <div className="p-8 text-center text-white/20 text-sm">
                กำลังโหลด...
              </div>
            ) : sortedDates.length === 0 ? (
              <div className="p-8 text-center text-white/20 text-sm">
                ไม่มีข้อมูลในช่วงนี้
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                {sortedDates.map((dateKey) => {
                  const dayAttendances = groupedByDate[dateKey];
                  const dateLabel = new Date(dateKey).toLocaleDateString(
                    "th-TH",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    },
                  );
                  const dayHours = dayAttendances.reduce(
                    (sum, a) => sum + a.totalHours,
                    0,
                  );

                  return (
                    <div key={dateKey} className="p-4 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-white/60">
                          {dateLabel}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/30">
                          <span>{dayAttendances.length} คน</span>
                          <span>•</span>
                          <span>{dayHours.toFixed(1)} ชม.</span>
                        </div>
                      </div>

                      {dayAttendances.map((att) => {
                        const checkIn = att.checkIns?.[0];
                        const checkInTime = checkIn?.checkInTime
                          ? new Date(checkIn.checkInTime).toLocaleTimeString(
                              "th-TH",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )
                          : "-";
                        const checkOutTime = checkIn?.checkOutTime
                          ? new Date(checkIn.checkOutTime).toLocaleTimeString(
                              "th-TH",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )
                          : "-";

                        return (
                          <div
                            key={att.id}
                            className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 shrink-0">
                                {att.employee.firstName[0]}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-white/80">
                                  {att.employee.firstName}{" "}
                                  {att.employee.lastName}
                                </p>
                                <p className="text-[10px] text-white/30 font-mono">
                                  {checkInTime} – {checkOutTime}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={cn(
                                  "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                  statusColor[att.status],
                                )}
                              >
                                {statusLabel[att.status]}
                              </span>
                              {att.totalHours > 0 && (
                                <span className="text-[10px] text-white/30">
                                  {att.totalHours.toFixed(1)}h
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
