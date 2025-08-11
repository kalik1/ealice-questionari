import { SetMetadata } from '@nestjs/common';

import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { UserRoles } from '../user/entities/UserRoles.enum';

export const ROLES_KEY = 'uo_roles' as const;
export const Roles = (
  ...roles: UserRoles[]
): CustomDecorator<typeof ROLES_KEY> =>
  SetMetadata(ROLES_KEY, [...new Set(roles)]);
