import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateSingleDto } from './create-single.dto';
import { Expose } from "class-transformer";

export class CreateSingleTextDto extends CreateSingleDto {
  @ApiProperty({
    type: 'string',
  })
  @IsString()
  @Expose()
  value: string;
}
