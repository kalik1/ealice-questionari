import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IdNameDto } from 'src/base/dto/idName.dto';
import { Gender } from '../../base/enum/sex.enum';
import { UserRoles } from '../entities/UserRoles.enum';

export class ReadUserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  yearOfBirth: number;

  @ApiProperty({
    enum: Gender,
  })
  @Expose()
  gender: Gender;

  @ApiProperty({
    enum: UserRoles,
  })
  @Expose()
  role: UserRoles;

  @Exclude()
  password?: never;

  @ApiPropertyOptional({
    type: IdNameDto,
  })
  @Expose()
  @Type(() => IdNameDto)
  coop?: IdNameDto;
}
