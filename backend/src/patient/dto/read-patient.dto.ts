import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Gender } from '../../base/enum/sex.enum';
import { IsOptional } from 'class-validator';

export class ReadPatientDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty({
    type: 'number',
  })
  @Expose()
  yearOfBirth: number;

  @ApiProperty({
    enum: Gender,
  })
  @Expose()
  gender: Gender;

  @ApiPropertyOptional()
  @Expose()
  @Transform(({ value }) => value || '')
  @IsOptional()
  notes: string;
}
