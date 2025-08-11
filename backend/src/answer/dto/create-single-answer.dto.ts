import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateSingleDto } from './create-single.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class CreateSingleAnswerDto extends CreateSingleDto {
  @ApiProperty({
    type: 'number',
  })
  @Transform(({ value }) =>
    value === '' || Number.isNaN(value) ? null : Number(value),
  )
  @IsNumber({ allowNaN: true })
  @Expose()
  value: number;
}
