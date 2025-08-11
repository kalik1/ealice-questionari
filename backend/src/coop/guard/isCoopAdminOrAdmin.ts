import { applyDecorators, UseGuards } from '@nestjs/common';
import { CoopGuard } from './coop.guard';
import { IsLoggedIn } from '../../auth/guard/isLoggedIn.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRoles } from '../../user/entities/UserRoles.enum';
import { RolesGuard } from '../../auth/guard/role.guard';

export function IsCoopAdminOrAdmin() {
  return applyDecorators(
    IsLoggedIn(),
    Roles(UserRoles.coop_admin, UserRoles.admin),
    UseGuards(CoopGuard, RolesGuard),
  );
}
