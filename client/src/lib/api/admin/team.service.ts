import { api } from "@/lib/api/client";
import type { Team } from "./team.type";

export type TeamPayload = { name: string };

const getAll = () => api.get<Team[]>("/teams");
const getById = (id: string) => api.get<Team>(`/teams/${id}`);
const create = (data: TeamPayload) => api.post<Team>("/teams", data);
const update = (id: string, data: Partial<TeamPayload>) =>
  api.patch<Team>(`/teams/${id}`, data);
const remove = (id: string) => api.delete<void>(`/teams/${id}`);
const addMember = (teamId: string, employeeId: string) =>
  api.patch<void>(`/teams/${teamId}/members/${employeeId}`);
const removeMember = (teamId: string, employeeId: string) =>
  api.delete<void>(`/teams/${teamId}/members/${employeeId}`);

export const teamService = {
  getAll,
  getById,
  create,
  update,
  remove,
  addMember,
  removeMember,
};
