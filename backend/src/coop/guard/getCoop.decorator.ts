import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRoles } from '../../user/entities/UserRoles.enum';

export const GetCoop = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user.role === UserRoles.admin) return [];
    return [request.coop];
  },
);
