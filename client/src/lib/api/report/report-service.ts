import { api } from "@/lib/api/client";
import type { ReportWithAttendance } from "./report.type";

const getMyReports = () => api.get<ReportWithAttendance[]>("/reports/me");
const getAllReports = () => api.get<ReportWithAttendance[]>("/reports");
const create = (formData: FormData) =>
  api.post<ReportWithAttendance>("/reports", formData);
const approveReport = (reportId: string) =>
  api.patch<ReportWithAttendance>(`/reports/${reportId}/approve`);
const rejectReport = (reportId: string) =>
  api.patch<ReportWithAttendance>(`/reports/${reportId}/reject`);

export const reportService = {
  getMyReports,
  getAllReports,
  create,
  approveReport,
  rejectReport,
};
