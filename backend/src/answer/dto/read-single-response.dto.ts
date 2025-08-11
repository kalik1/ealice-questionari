import { ApiProperty } from '@nestjs/swagger';
import { CreateSingleDto } from './create-single.dto';
import { Expose } from 'class-transformer';

export class ReadSingleResponseDto extends CreateSingleDto {
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
  })
  @Expose()
  value: number | string;
}
