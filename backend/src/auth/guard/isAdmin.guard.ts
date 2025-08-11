import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRoles } from '../../user/entities/UserRoles.enum';
import { RolesGuard } from './role.guard';
import { Roles } from '../roles.decorator';

export function isAdmin() {
  return applyDecorators(
    Roles(UserRoles.admin),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
  );
}
