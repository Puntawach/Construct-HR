import { Badge } from "@/components/ui/badge";
import type {
  AttendanceStatus,
  ReportStatus,
  EmployeeStatus,
  Role,
} from "@/lib/types";

// Attendance status badge
export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const map: Record<AttendanceStatus, { label: string; className: string }> = {
    WORKING: {
      label: "Working",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    SUBMITTED: {
      label: "Submitted",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

// Report status badge
export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const map: Record<ReportStatus, { label: string; className: string }> = {
    PENDING: {
      label: "Pending",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

// Employee status badge
export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  const map: Record<EmployeeStatus, { label: string; className: string }> = {
    ACTIVE: {
      label: "Active",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    INACTIVE: {
      label: "Inactive",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    DELETE: {
      label: "Deleted",
      className: "bg-red-100 text-red-700 border-red-200",
    }, // แก้ DELETED → DELETE
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
// Role badge
export function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, { label: string; className: string }> = {
    WORKER: {
      label: "Worker",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    LEADER: {
      label: "Leader",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    ADMIN: {
      label: "Admin",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    SUPER_ADMIN: {
      label: "Super Admin",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };
  const { label, className } = map[role];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
