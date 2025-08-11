import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IdNameDto } from '../../base/dto/idName.dto';
import { IdNameRoleDto } from '../../base/dto/idNameRole.dto';
import { ReadUserDto } from '../../user/dto/read-user.dto';

export class ReadCoopDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  phone: string;

  @ApiProperty({
    type: ReadUserDto,
    isArray: true,
  })
  @Expose()
  @Type(() => ReadUserDto)
  users: ReadUserDto[];
}
