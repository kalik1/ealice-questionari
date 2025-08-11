import { applyDecorators, UseGuards } from '@nestjs/common';
import { CoopGuard } from './coop.guard';
import { IsLoggedIn } from '../../auth/guard/isLoggedIn.guard';

export function IsCoopMember() {
  return applyDecorators(IsLoggedIn(), UseGuards(CoopGuard));
}
