import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateSingleDto } from './create-single.dto';
import { Expose } from 'class-transformer';

export class CreateSingleResponseDto extends CreateSingleDto {
  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  @IsNumber({ allowNaN: true })
  @Expose()
  value: number | null;
}
