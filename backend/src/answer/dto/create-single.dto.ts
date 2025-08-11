import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export abstract class CreateSingleDto {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @Expose()
  key: string;
}
