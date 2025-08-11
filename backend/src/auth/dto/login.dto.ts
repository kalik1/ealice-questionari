import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  password: string;

  @Expose()
  @ApiPropertyOptional({
    default: false,
  })
  rememberMe?: boolean;
}
