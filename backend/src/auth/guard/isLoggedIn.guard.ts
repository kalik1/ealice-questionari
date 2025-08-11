import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function IsLoggedIn() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
