import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRoles } from '../entities/UserRoles.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRoleSetGuard implements CanActivate {
  static coopAdminCanEdit = [UserRoles.coop_admin, UserRoles.user];
  static userCanEdit = [UserRoles.user];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { body, user }: { user: User; body: CreateUserDto | UpdateUserDto } =
      req;
    if (!body || !user) {
      return false;
    }
    if (!body.role) {
      return true;
    }
    if (user.role === UserRoles.admin) {
      return true;
    } else if (user.role === UserRoles.coop_admin) {
      if (!UserRoleSetGuard.coopAdminCanEdit.includes(user.role)) {
        return false;
      }
    } else if (user.role === UserRoles.user) {
      if (!UserRoleSetGuard.userCanEdit.includes(user.role)) {
        return false;
      }
    }
  }
}
