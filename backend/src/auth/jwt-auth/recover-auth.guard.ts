import { NotificationService } from '@/src/notification/notification.service';
import { UserService } from '@/src/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import logger from 'logger';

@Injectable()
export class RecoveryAuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT Secret não configurado');
    this.jwtSecret = jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    await this.validateRecoveryToken(token, request);
    return true;
  }

  private extractToken(request: Request): string {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Cabeçalho de autorização ausente');
    }
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato do token inválido');
    }
    return token;
  }

  private async validateRecoveryToken(
    token: string,
    request: Request,
  ): Promise<void> {
    const payload = await this.extractPayloadFromToken(token);

    try {
      if (!payload.recoverPassword) {
        throw new UnauthorizedException('Token não é de recuperação');
      }

      const user = await this.userService.findOneByOrFail('id', payload.sub);

      request['user'] = {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      logger.error('Falha na autenticação de recuperação:', error.message);
      await this.sendSwitchPasswordErrorNotification(payload);
      throw new UnauthorizedException('Token de recuperação inválido');
    }
  }

  async extractPayloadFromToken(token: string): Promise<{
    sub: string;
    login: string;
    recoverPassword: boolean;
  }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
    } catch (error) {
      logger.error('Falha na autenticação de recuperação:', error.message);
      throw new UnauthorizedException('Token de recuperação inválido');
    }
  }

  async sendSwitchPasswordErrorNotification(payload: {
    sub: string;
    login: string;
    recoverPassword: boolean;
  }) {
    if (payload.sub) {
      await this.notificationService.sendNotification(
        payload.sub,
        'Erro na alteração da senha',
        'Houve um erro ao tentar alterar sua senha',
      );
    }
  }
}
