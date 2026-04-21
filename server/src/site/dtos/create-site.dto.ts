import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  long!: number;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'shiftStart must be HH:MM',
  })
  shiftStart?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'shiftEnd must be HH:MM' })
  shiftEnd?: string;
}
