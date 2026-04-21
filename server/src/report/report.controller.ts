import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReportService } from './report.service';
import { CurrentEmployee } from 'src/auth/decorators/current-employee.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10)) // max 10 รูป
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('attendanceId') attendanceId: string,
    @Body('detail') detail: string,
    @CurrentEmployee() employee: JwtPayload,
  ) {
    return this.reportService.create(employee.sub, files, attendanceId, detail);
  }

  @Get('me')
  getMyReports(@CurrentEmployee() employee: JwtPayload) {
    return this.reportService.getMyReports(employee.sub);
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get()
  getAllReports() {
    return this.reportService.getAllReports();
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':reportId/approve')
  approve(@Param('reportId') reportId: string) {
    return this.reportService.approve(reportId);
  }

  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':reportId/reject')
  reject(@Param('reportId') reportId: string) {
    return this.reportService.reject(reportId);
  }
}
