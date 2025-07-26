import { UserService } from '@/src/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT Secret não foi providenciado');
    }

    this.jwtSecret = jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.getTokenFromHeader(request);
    await this.validateAndAttachUser(token, request);

    return true;
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  private getTokenFromHeader(request: Request): string {
    const authorization = this.checkAuthorizationHeader(request);

    const [type, token] = authorization.split(' ');
    this.checkTokenType(type, token);

    if (!token)
      throw new UnauthorizedException(
        'Token de autorização não foi providenciado',
      );

    return token;
  }

  private checkAuthorizationHeader(request: Request): string {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Autorização do header não existe');
    }
    return authorization;
  }

  private checkTokenType(type: string, token: string): void {
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }
  }

  private async validateAndAttachUser(
    token: string,
    request: Request,
  ): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      if (payload.recoverPassword) throw new UnauthorizedException();

      await this.userService.findOneByOrFail('id', payload.sub);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
