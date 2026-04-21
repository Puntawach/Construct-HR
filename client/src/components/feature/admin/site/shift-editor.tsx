"use client";

import { useState, useTransition } from "react";
import { Check, Pencil, X } from "lucide-react";
import { updateSiteAction } from "@/lib/actions/admin/site.action";
import type { Site } from "@/lib/api/site/site.type";
import { useRouter } from "next/navigation";

type Props = { site: Site };

export default function ShiftEditor({ site }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [start, setStart] = useState(site.shiftStart);
  const [end, setEnd] = useState(site.shiftEnd);

  // คำนวณชั่วโมงทำงานปกติ
  function calcShiftHours(s: string, e: string) {
    const [sh, sm] = s.split(":").map(Number);
    const [eh, em] = e.split(":").map(Number);
    const total = eh * 60 + em - (sh * 60 + sm);
    return (total / 60).toFixed(1);
  }

  function handleSave() {
    startTransition(async () => {
      await updateSiteAction(site.id, { shiftStart: start, shiftEnd: end });
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-[10px] text-white/40">เข้างาน</p>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/40">ออกงาน</p>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 flex justify-between items-center">
            <span className="text-xs text-blue-400">ชั่วโมงปกติ</span>
            <span className="text-sm font-bold text-blue-400">
              {calcShiftHours(start, end)} ชม./วัน
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
              disabled={isPending}
              onClick={handleSave}
            >
              <Check size={12} /> บันทึก
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-white/10 text-white/60 text-xs rounded-lg"
              onClick={() => {
                setEditing(false);
                setStart(site.shiftStart);
                setEnd(site.shiftEnd);
              }}
            >
              <X size={12} /> ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              {site.shiftStart} – {site.shiftEnd}
            </p>
            <p className="text-xs text-white/30">
              {calcShiftHours(site.shiftStart, site.shiftEnd)} ชม./วัน ปกติ
            </p>
          </div>
          <button
            className="w-7 h-7 flex items-center justify-center border border-white/10 text-white/60 hover:bg-white/10 rounded-lg"
            onClick={() => setEditing(true)}
          >
            <Pencil size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
