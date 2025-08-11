import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enum/sex.enum';

export class IdNameGenderDto {
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

  @ApiProperty({
    enum: Gender,
  })
  @Expose()
  gender: Gender;

  // @Expose()
  // @ApiProperty({
  //   type: IdNameDto,
  //   isArray: true
  // })
  // users: IdNameDto[];
}
