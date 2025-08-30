import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CoopGuard } from './coop.guard';

@Injectable()
export class GqlCoopGuard extends CoopGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    // Delegate to HTTP guard by substituting context
    const httpContext = {
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
    return super.canActivate(httpContext);
  }
}


