import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const resourceParam =
      this.reflector.get<string>('resourceParam', context.getHandler()) || 'id';

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params[resourceParam];

    if (
      user.sub !== resourceId &&
      user.login !== resourceId &&
      user.idWallet !== resourceId
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este recurso.',
      );
    }
    return true;
  }
}

export const SetResourceParam = (param: string) =>
  SetMetadata('resourceParam', param);
