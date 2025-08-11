import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UserRoles } from '../../user/entities/UserRoles.enum';

@Injectable()
export class CoopGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user }: { user: User } = req;
    if (!user) {
      return false;
    }
    if (user.role === UserRoles.admin) {
      req.coop = [];
      return true;
    }
    if (!user.coop) {
      return false;
    }
    req.coop = user.coop;
    return true;
  }
}
