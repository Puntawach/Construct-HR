/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `ReportImage` table. All the data in the column will be lost.
  - You are about to drop the column `detail` on the `ReportImage` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ReportImage` table. All the data in the column will be lost.
  - Added the required column `reportId` to the `ReportImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReportImage" DROP CONSTRAINT "ReportImage_attendanceId_fkey";

-- AlterTable
ALTER TABLE "ReportImage" DROP COLUMN "deletedAt",
DROP COLUMN "detail",
DROP COLUMN "status",
ADD COLUMN     "reportId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "deletedAt" TIMESTAMP(3),
    "attendanceId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportImage" ADD CONSTRAINT "ReportImage_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportImage" ADD CONSTRAINT "ReportImage_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
