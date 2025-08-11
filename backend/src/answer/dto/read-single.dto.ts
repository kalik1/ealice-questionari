import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class ReadSingleDto {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  key: string;
}
