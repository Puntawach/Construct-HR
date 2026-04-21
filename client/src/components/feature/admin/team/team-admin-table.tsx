'use client'

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, UsersRound, Check, X, ChevronDown, ChevronUp, UserPlus, UserMinus } from "lucide-react"
import {
  createTeamAction, updateTeamAction, deleteTeamAction,
  addMemberAction, removeMemberAction,
} from "@/lib/actions/admin/team.action"
import type { Team } from "@/lib/api/admin/team.type"
import type { Employee } from "@/lib/types"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Props = { teams: Team[]; employees: Employee[] }

export default function TeamAdminTable({ teams, employees }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editName, setEditName] = useState("")
  const [createName, setCreateName] = useState("")
  const [showAddMember, setShowAddMember] = useState<string | null>(null)

  function handleCreate() {
    if (!createName.trim()) return
    startTransition(async () => {
      await createTeamAction({ name: createName })
      setShowCreate(false)
      setCreateName("")
      router.refresh()
    })
  }

  function handleUpdate(id: string) {
    startTransition(async () => {
      await updateTeamAction(id, { name: editName })
      setEditingId(null)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTeamAction(id)
      router.refresh()
    })
  }

  function handleAddMember(teamId: string, employeeId: string) {
    startTransition(async () => {
      await addMemberAction(teamId, employeeId)
      setShowAddMember(null)
      router.refresh()
    })
  }

  function handleRemoveMember(teamId: string, employeeId: string) {
    startTransition(async () => {
      await removeMemberAction(teamId, employeeId)
      router.refresh()
    })
  }

  // พนักงานที่ยังไม่มีทีม หรืออยู่ทีมอื่น สำหรับ add member
  function getAvailableEmployees(team: Team) {
    const memberIds = new Set(team.employees.map((e) => e.id))
    return employees.filter((e) => !memberIds.has(e.id) && e.status === "ACTIVE")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          onClick={() => { setShowCreate(true); setEditingId(null) }}
        >
          <Plus size={16} />
          เพิ่มทีม
        </button>
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
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              disabled={!createName.trim() || isPending}
              onClick={handleCreate}
            >
              <Check size={14} /> บันทึก
            </button>
            <button
              className="px-3 py-1.5 border border-white/10 text-white/60 hover:bg-white/5 text-sm rounded-lg shrink-0"
              onClick={() => setShowCreate(false)}
            >
              <X size={14} />
            </button>
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
          teams.map((team) => {
            const available = getAvailableEmployees(team)
            const isExpanded = expandedId === team.id

            return (
              <div key={team.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                {/* Team header */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <UsersRound size={16} className="text-blue-400" />
                    </div>

                    {editingId === team.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-8 text-sm w-48"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate(team.id)}
                      />
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-white">{team.name}</p>
                        <p className="text-xs text-white/40">
                          {team.employees.length} สมาชิก
                          {team.leader && ` • หัวหน้า: ${team.leader.firstName}`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === team.id ? (
                      <>
                        <button
                          className="w-7 h-7 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                          disabled={isPending}
                          onClick={() => handleUpdate(team.id)}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-white/10 text-white/60 hover:bg-white/5 rounded-lg"
                          onClick={() => setEditingId(null)}
                        >
                          <X size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-white/10 text-white/60 hover:bg-white/5 rounded-lg"
                          onClick={() => { setEditingId(team.id); setEditName(team.name); setShowCreate(false) }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                          disabled={isPending}
                          onClick={() => handleDelete(team.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-white/40 hover:bg-white/5 rounded-lg"
                          onClick={() => setExpandedId(isExpanded ? null : team.id)}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Members section */}
                {isExpanded && (
                  <div className="border-t border-white/10">
                    {/* Member list */}
                    {team.employees.length > 0 && (
                      <div className="divide-y divide-white/5">
                        {team.employees.map((emp) => (
                          <div key={emp.id} className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                                {emp.firstName[0]}
                              </div>
                              <div>
                                <p className="text-sm text-white/80 font-medium">
                                  {emp.firstName} {emp.lastName}
                                </p>
                                <p className="text-[10px] text-white/40">{emp.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {team.leaderId === emp.id && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  หัวหน้าทีม
                                </span>
                              )}
                              <button
                                className="w-7 h-7 flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                                disabled={isPending}
                                onClick={() => handleRemoveMember(team.id, emp.id)}
                              >
                                <UserMinus size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add member */}
                    <div className="px-5 py-3 bg-white/[0.02]">
                      {showAddMember === team.id ? (
                        <div className="space-y-2">
                          <p className="text-xs text-white/40 font-semibold uppercase tracking-wide">เพิ่มสมาชิก</p>
                          {available.length === 0 ? (
                            <p className="text-xs text-white/30 py-2">ไม่มีพนักงานที่สามารถเพิ่มได้</p>
                          ) : (
                            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                              {available.map((emp) => (
                                <button
                                  key={emp.id}
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-left transition-colors disabled:opacity-50"
                                  disabled={isPending}
                                  onClick={() => handleAddMember(team.id, emp.id)}
                                >
                                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 shrink-0">
                                    {emp.firstName[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm text-white/70">{emp.firstName} {emp.lastName}</p>
                                    <p className="text-[10px] text-white/30">{emp.role}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          <button
                            className="text-xs text-white/40 hover:text-white/60 mt-1"
                            onClick={() => setShowAddMember(null)}
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold py-1 transition-colors"
                          onClick={() => setShowAddMember(team.id)}
                        >
                          <UserPlus size={13} />
                          เพิ่มสมาชิก
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}