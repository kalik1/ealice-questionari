import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/sign-in')
  @ApiResponse({ type: SignInResponseDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() userLoginData: LoginDto,
    @Request() req,
  ): Promise<SignInResponseDto> {
    return this.authService.login(userLoginData, req.user);
  }
}
