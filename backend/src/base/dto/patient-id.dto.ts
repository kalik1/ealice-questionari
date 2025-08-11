import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatientIdDto {
  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  patientId: string;
}
