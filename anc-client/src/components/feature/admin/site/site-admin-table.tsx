"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, MapPin, Check, X } from "lucide-react";
import {
  createSiteAction,
  updateSiteAction,
  deleteSiteAction,
} from "@/lib/actions/admin/site.action";
import type { Site } from "@/lib/api/site/site.type";
import { useRouter } from "next/navigation";

type Props = { sites: Site[] };

type FormState = { name: string; lat: string; long: string };

export default function SiteAdminTable({ sites }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", lat: "", long: "" });

  function startEdit(site: Site) {
    setEditingId(site.id);
    setForm({
      name: site.name,
      lat: String(site.lat),
      long: String(site.long),
    });
    setShowCreate(false);
  }

  function startCreate() {
    setShowCreate(true);
    setEditingId(null);
    setForm({ name: "", lat: "", long: "" });
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
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={startCreate}
        >
          <Plus size={16} />
          เพิ่มไซต์งาน
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-white">เพิ่มไซต์งานใหม่</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-white/60">ชื่อไซต์งาน</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="เช่น Bangkok Tower Project"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/60">Latitude</Label>
              <Input
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                placeholder="13.7563"
                type="number"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/60">Longitude</Label>
              <Input
                value={form.long}
                onChange={(e) => setForm({ ...form, long: e.target.value })}
                placeholder="100.5018"
                type="number"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
              disabled={!form.name || !form.lat || !form.long || isPending}
              onClick={handleCreate}
            >
              <Check size={14} /> บันทึก
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white/60 hover:bg-white/5"
              onClick={() => setShowCreate(false)}
            >
              <X size={14} /> ยกเลิก
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        {sites.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MapPin size={32} className="text-white/20 mx-auto" />
            <p className="text-sm text-white/40">ยังไม่มีไซต์งาน</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["ชื่อไซต์งาน", "Latitude", "Longitude", "จัดการ"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sites.map((site) => (
                <tr
                  key={site.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {editingId === site.id ? (
                    <>
                      <td className="px-4 py-3">
                        <Input
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={form.lat}
                          onChange={(e) =>
                            setForm({ ...form, lat: e.target.value })
                          }
                          type="number"
                          className="bg-white/5 border-white/10 text-white h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={form.long}
                          onChange={(e) =>
                            setForm({ ...form, long: e.target.value })
                          }
                          type="number"
                          className="bg-white/5 border-white/10 text-white h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                            disabled={isPending}
                            onClick={() => handleUpdate(site.id)}
                          >
                            <Check size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 border-white/10 text-white/60"
                            onClick={() => setEditingId(null)}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={14}
                            className="text-blue-400 shrink-0"
                          />
                          <span className="text-white font-medium">
                            {site.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/60 font-mono text-xs">
                        {site.lat}
                      </td>
                      <td className="px-4 py-3 text-white/60 font-mono text-xs">
                        {site.long}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 border-white/10 text-white/60 hover:bg-white/5"
                            onClick={() => startEdit(site)}
                          >
                            <Pencil size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                            disabled={isPending}
                            onClick={() => handleDelete(site.id)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
