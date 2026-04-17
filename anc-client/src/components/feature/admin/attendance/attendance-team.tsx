"use client";

import type { Team } from "@/lib/api/admin/team.type";
import { cn } from "@/lib/utils";

type Props = {
  teams: Team[];
  selectedTeamId: string;
  onSelect: (teamId: string) => void;
};

export default function TeamTabs({ teams, selectedTeamId, onSelect }: Props) {
  return (
    <div className="border-t border-white/10 bg-black/20 px-2 py-2 shrink-0 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {teams.map((team) => {
          const isActive = team.id === selectedTeamId;
          return (
            <button
              key={team.id}
              onClick={() => onSelect(team.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-white/40 hover:bg-white/5 hover:text-white",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded flex items-center justify-center text-xs font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/50",
                )}
              >
                {team.name[0]}
              </div>
              {team.name}
              <span
                className={cn(
                  "text-xs",
                  isActive ? "text-white/60" : "text-white/20",
                )}
              >
                {team.employees?.length ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
