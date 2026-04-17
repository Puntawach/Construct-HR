import type { ReportImage } from "@/lib/types";

export type ReportWithAttendance = ReportImage & {
  attendance: {
    workDate: string;
    site: { id: string; name: string };
    employee: {
      firstName: string;
      lastName: string;
    };
  };
};
