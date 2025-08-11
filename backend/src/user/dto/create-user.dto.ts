import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ResourceFromId } from '../../base/dto/transforms/rersource-from-id.transform';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Coop } from '../../coop/entities/coop.entity';
import { PasswordHash } from '../../base/dto/transforms/password-hash.transform';
import { IsResourceUUID } from '../../base/dto/validators/resource-uuid.validator';
import { Gender } from '../../base/enum/sex.enum';
import { UserRoles } from '../entities/UserRoles.enum';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty()
  @PasswordHash()
  @Expose()
  password: string;

  @ApiProperty({
    default: 1950,
    type: 'number',
  })
  @Expose()
  @IsNumber()
  @Min(1900)
  @Max(2050)
  yearOfBirth: number;

  @ApiProperty({
    enum: Gender,
  })
  @Expose()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    enum: UserRoles,
  })
  @Expose()
  @IsOptional()
  @IsEnum(UserRoles)
  @Transform(({ value }) => (value ? value : undefined))
  role: UserRoles;

  @ApiProperty({
    type: 'string',
    minLength: 3,
  })
  @Expose()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'uuid',
  })
  @Expose()
  @ResourceFromId(Coop)
  @IsResourceUUID()
  coop?: Coop;
}
