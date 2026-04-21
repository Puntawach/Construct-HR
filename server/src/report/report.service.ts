import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CloudinaryService } from 'src/shared/upload/cloudinary.service';
import { ReportStatus } from 'src/database/generated/prisma/client';

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    employeeId: string,
    files: Express.Multer.File[],
    attendanceId: string,
    detail: string,
  ) {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id: attendanceId, employeeId },
    });

    if (!attendance) throw new NotFoundException('Attendance not found');
    if (!files || files.length === 0)
      throw new BadRequestException('At least one image is required');

    // Upload all images to cloudinary
    const uploadResults = await this.cloudinaryService.uploadMany(files);

    // Create report with images
    return this.prisma.report.create({
      data: {
        attendanceId,
        detail,
        images: {
          create: uploadResults.map((result) => ({
            imageUrl: result.secure_url,
          })),
        },
      },
      include: { images: true },
    });
  }

  async getMyReports(employeeId: string) {
    return this.prisma.report.findMany({
      where: {
        deletedAt: null,
        attendance: { employeeId },
      },
      include: {
        images: true,
        attendance: {
          select: {
            workDate: true,
            site: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllReports() {
    return this.prisma.report.findMany({
      where: { deletedAt: null },
      include: {
        images: true,
        attendance: {
          select: {
            workDate: true,
            site: true,
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                teamId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(reportId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });

    if (!report) throw new NotFoundException('Report not found');
    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException('Report is not in PENDING status');
    }

    return this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.APPROVED },
    });
  }

  async reject(reportId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });

    if (!report) throw new NotFoundException('Report not found');
    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException('Report is not in PENDING status');
    }

    return this.prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.REJECTED, deletedAt: new Date() },
    });
  }
}
