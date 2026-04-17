"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  UsersRound,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createTeamAction,
  updateTeamAction,
  deleteTeamAction,
} from "@/lib/actions/admin/team.action";
import type { Team } from "@/lib/api/admin/team.type";
import type { Employee } from "@/lib/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = { teams: Team[]; employees: Employee[] };

export default function TeamAdminTable({ teams, employees }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editName, setEditName] = useState("");
  const [createName, setCreateName] = useState("");

  function handleCreate() {
    startTransition(async () => {
      await createTeamAction({ name: createName });
      setShowCreate(false);
      setCreateName("");
      router.refresh();
    });
  }

  function handleUpdate(id: string) {
    startTransition(async () => {
      await updateTeamAction(id, { name: editName });
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTeamAction(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            setShowCreate(true);
            setEditingId(null);
          }}
        >
          <Plus size={16} />
          เพิ่มทีม
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-white">เพิ่มทีมใหม่</p>
          <div className="flex gap-3">
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="ชื่อทีม เช่น Team Alpha"
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1 shrink-0"
              disabled={!createName || isPending}
              onClick={handleCreate}
            >
              <Check size={14} /> บันทึก
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-white/60 hover:bg-white/5 shrink-0"
              onClick={() => setShowCreate(false)}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Team list */}
      <div className="space-y-3">
        {teams.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center space-y-2">
            <UsersRound size={32} className="text-white/20 mx-auto" />
            <p className="text-sm text-white/40">ยังไม่มีทีมงาน</p>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              {/* Team header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <UsersRound size={15} className="text-blue-400" />
                  </div>
                  {editingId === team.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-8 text-sm w-48"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {team.name}
                      </p>
                      <p className="text-xs text-white/40">
                        {team.employees.length} คน
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {editingId === team.id ? (
                    <>
                      <Button
                        size="sm"
                        className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                        disabled={isPending}
                        onClick={() => handleUpdate(team.id)}
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
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-white/10 text-white/60 hover:bg-white/5"
                        onClick={() => {
                          setEditingId(team.id);
                          setEditName(team.name);
                          setShowCreate(false);
                        }}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        disabled={isPending}
                        onClick={() => handleDelete(team.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-white/40 hover:bg-white/5"
                        onClick={() =>
                          setExpandedId(expandedId === team.id ? null : team.id)
                        }
                      >
                        {expandedId === team.id ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Members */}
              {expandedId === team.id && (
                <div className="border-t border-white/10 px-4 py-3 space-y-2">
                  {team.employees.length === 0 ? (
                    <p className="text-xs text-white/30 py-2">
                      ยังไม่มีสมาชิกในทีม
                    </p>
                  ) : (
                    team.employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between py-1.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">
                            {emp.firstName[0]}
                          </div>
                          <div>
                            <p className="text-sm text-white/80">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-[10px] text-white/40">
                              {emp.role}
                            </p>
                          </div>
                        </div>
                        {team.leaderId === emp.id && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            หัวหน้าทีม
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
