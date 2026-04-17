export type AttendanceStatus =
  | "WORKING"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type CheckIn = {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  attendanceId: string;
};

export type AttendanceWithEmployee = {
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
  payrollPeriodId: string | null;
  checkIns: CheckIn[];
  createdAt: string;
  updatedAt: string;
  site: {
    id: string;
    name: string;
    lat: number;
    long: number;
  };
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    teamId: string | null;
    avatarUrl: string | null;
  };
};
