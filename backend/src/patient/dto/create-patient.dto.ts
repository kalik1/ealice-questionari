import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { Gender } from '../../base/enum/sex.enum';

export class CreatePatientDto {
  @ApiProperty({
    default: 1950,
    type: 'number',
  })
  @Expose()
  @IsNumber()
  @Min(1900)
  @Max(2050)
  yearOfBirth: number;

  @ApiProperty({
    enum: Gender,
  })
  @Expose()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    type: 'string',
  })
  @Expose()
  notes: string;
}
