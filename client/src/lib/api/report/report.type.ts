export type ReportImage = {
  id: string;
  imageUrl: string;
  reportId: string;
  createdAt: string;
};

export type ReportWithAttendance = {
  id: string;
  detail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  images: ReportImage[];
  attendance: {
    workDate: string;
    site: { id: string; name: string };
    employee?: {
      firstName: string;
      lastName: string;
      teamId: string | null;
    };
  };
};
