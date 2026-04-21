import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AdminEditAttendanceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  normalHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otHours?: number;

  @IsOptional()
  @IsString()
  overrideNote?: string;
}
