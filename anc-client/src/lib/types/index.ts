import { Employee } from "@/lib/api/employee/employee.type";

export type {
  Employee,
  EmployeeStatus,
  Role,
} from "@/lib/api/employee/employee.type";

export type AttendanceStatus =
  | "WORKING"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";
export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CheckIn = {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  attendanceId: string;
};

export type Site = {
  id: string;
  name: string;
  lat: number;
  long: number;
};

export type Attendance = {
  id: string;
  workDate: string;
  totalHours: number;
  normalHours: number;
  otHours: number;
  workDescription: string | null;
  issues: string | null;
  status: AttendanceStatus;
  employeeId: string;
  siteId: string;
  site?: Site;
  checkIns: CheckIn[];
};

export type ReportImage = {
  id: string;
  imageUrl: string;
  detail: string;
  status: ReportStatus;
  attendanceId: string;
  createdAt: string;
};

export type PayrollPeriod = {
  id: string;
  month: number;
  year: number;
  isLocked: boolean;
};

export type PayrollItem = {
  id: string;
  normalHours: number;
  otHours: number;
  workDays: number;
  normalPay: string;
  otPay: string;
  allowance: string;
  totalPay: string;
  employeeId: string;
  payrollPeriodId: string;
  payrollPeriod: PayrollPeriod;
};

export type Team = {
  id: string;
  name: string;
  leaderId: string | null;
  leader: Employee | null;
  employees: Employee[];
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  path: string;
  timestamp: string;
};

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};
