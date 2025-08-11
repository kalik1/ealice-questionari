import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdNameDto {
  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    example: 'Name',
  })
  name: string;

  // @Expose()
  // @ApiProperty({
  //   type: IdNameDto,
  //   isArray: true
  // })
  // users: IdNameDto[];
}
