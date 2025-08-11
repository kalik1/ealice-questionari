import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../../user/entities/UserRoles.enum';

export class IdNameRoleDto {
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
    format: 'uuid',
  })
  name: string;

  @Expose()
  @ApiProperty({
    enum: UserRoles,
  })
  role: UserRoles;
}
