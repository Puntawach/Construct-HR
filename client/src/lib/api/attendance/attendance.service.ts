import { api } from "@/lib/api/client";
import { Attendance } from "@/lib/types";
import { AttendanceWithEmployee } from "./attendance.type";

export type CheckInPayload = {
  siteId: string;
  workDate: string;
  checkInTime: string;
};

export type CheckOutPayload = {
  checkOutTime: string;
  workDescription?: string;
  issues?: string;
};

const getMyAttendance = () => api.get<Attendance[]>("/attendance/me");

const getByEmployee = (employeeId: string) =>
  api.get<Attendance[]>(`/attendance/employee/${employeeId}`);

const checkIn = (payload: CheckInPayload) =>
  api.post<Attendance>("/attendance/check-in", payload);

const checkOut = (attendanceId: string, payload: CheckOutPayload) =>
  api.patch<Attendance>(`/attendance/${attendanceId}/check-out`, payload);

const approve = (attendanceId: string) =>
  api.patch<Attendance>(`/attendance/${attendanceId}/approve`);

const reject = (attendanceId: string) =>
  api.patch<Attendance>(`/attendance/${attendanceId}/reject`);

const getAllByMonth = (month: number, year: number) =>
  api.get<AttendanceWithEmployee[]>(
    `/attendance/admin/all?month=${month}&year=${year}`,
  );

const getBySite = (siteId: string) =>
  api.get<AttendanceWithEmployee[]>(`/attendance/admin/site/${siteId}`);
const adminEdit = (
  attendanceId: string,
  data: { normalHours?: number; otHours?: number; overrideNote?: string },
) => api.patch<Attendance>(`/attendance/${attendanceId}/admin-edit`, data);

export const attendanceService = {
  getMyAttendance,
  getByEmployee,
  checkIn,
  checkOut,
  getAllByMonth,
  approve,
  reject,
  getBySite,
  adminEdit,
};
