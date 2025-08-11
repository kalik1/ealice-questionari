import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from '../../user/dto/read-user.dto';
import { Expose } from 'class-transformer';

export class SignInResponseDto {
  @ApiProperty({
    type: ReadUserDto,
  })
  @Expose()
  user: ReadUserDto;

  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty({
    enum: ['bearer'],
  })
  @Expose()
  tokenType: 'bearer';

  @ApiProperty({
    type: 'number',
    minimum: 0,
  })
  @Expose()
  expiresIn: number;
}
