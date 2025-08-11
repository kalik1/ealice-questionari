import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ReadUserDto } from '../user/dto/read-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<ReadUserDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(pass, user.password);
    if (isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userLoginData: LoginDto, user: User) {
    const payload = { email: user.email };
    const expiresIn = userLoginData.rememberMe ? 315360000 : 3600;

    //                     user       : cloneDeep(this._user),
    //                     accessToken: this._generateJWTToken(),
    //                     tokenType  : 'bearer'

    return {
      user: plainToClass(ReadUserDto, user, {
        excludeExtraneousValues: true,
      }) as ReadUserDto,
      accessToken: this.jwtService.sign(payload, { expiresIn }),
      tokenType: <const>'bearer',
      expiresIn,
    };
  }
}
