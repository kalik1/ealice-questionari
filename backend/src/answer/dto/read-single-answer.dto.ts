import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateSingleDto } from './create-single.dto';
import { Expose } from 'class-transformer';

export class ReadSingleAnswerDto extends CreateSingleDto {
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
  })
  @Expose()
  value: number | string;
}
