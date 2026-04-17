import { api } from "@/lib/api/client";
import type { ReportImage } from "@/lib/types";
import { ReportWithAttendance } from "./report.type";

const getMyReports = () => api.get<ReportWithAttendance[]>("/reports/me");
const getAllReports = () => api.get<ReportWithAttendance[]>("/reports");
const create = (formData: FormData) =>
  api.post<ReportImage>("/reports", formData);
const approveReport = (reportId: string) =>
  api.patch<ReportImage>(`/reports/${reportId}/approve`);
const rejectReport = (reportId: string) =>
  api.patch<ReportImage>(`/reports/${reportId}/reject`);

export const reportService = {
  getMyReports,
  getAllReports,
  create,
  approveReport,
  rejectReport,
};
