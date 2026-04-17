import { api } from "@/lib/api/client";
import type { Site } from "./site.type";

export type SitePayload = {
  name: string;
  lat: number;
  long: number;
};

const getAll = () => api.get<Site[]>("/sites");
const getById = (id: string) => api.get<Site>(`/sites/${id}`);
const create = (data: SitePayload) => api.post<Site>("/sites", data);
const update = (id: string, data: Partial<SitePayload>) =>
  api.patch<Site>(`/sites/${id}`, data);
const remove = (id: string) => api.delete<void>(`/sites/${id}`);

export const siteService = { getAll, getById, create, update, remove };
