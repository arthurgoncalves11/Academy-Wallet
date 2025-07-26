import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync as bcryptCompareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/src/user/user.service';
import { AuthResponseDto } from '@/src/auth/dto/auth.dto';
import { User } from '@/src/user/entities/user.entity';
import { EmailService } from '../common/services/email.service';
import { VerifyEmailTokenDto } from '../user/dto/verify-email-token.dto';
import { NotificationService } from '../notification/notification.service';
import { PasswordService } from '../common/services/password.service';

@Injectable()
export class AuthService {
  userRole: string;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
    private readonly passwordService: PasswordService,
  ) {}

  private get jwtRecoveryExpirationTimeInSeconds(): number {
    return Number(process.env.JWT_RECOVERY_EXPIRATION_TIME);
  }

  private get jwtExpirationTimeInSeconds(): number {
    return Number(process.env.JWT_EXPIRATION_TIME);
  }

  async signIn(login: string, password: string): Promise<AuthResponseDto> {
    const user = await this.validateUserCredentials(login, password);
    const token = this.generateToken(user);

    return {
      data: { token, expiresIn: this.jwtExpirationTimeInSeconds },
      message: 'Login efetuado com sucesso',
    };
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<Omit<User, 'recoveryToken'>> {
    const user = await this.userService.findFullUserBy('email', email);
    if (!user || !bcryptCompareSync(password, user.loginPassword)) {
      throw new UnauthorizedException('Credenciais invállidas.');
    }
    return user;
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      login: user.email,
      idWallet: user.wallet.id,
    };

    return this.jwtService.sign(payload);
  }

  async activeRedefinePassword(email: string) {
    const user = await this.userService.findFullUserByWithoutWallet(
      'email',
      email,
    );

    if (!user)
      throw new NotFoundException(`Usuário com e-mail ${email} não encontrado`);

    const recoverToken = this.generateRandomToken().toString();
    user.recoverToken = recoverToken;
    user.recoverTokenTimestamp = new Date();

    await this.userService.update(user.id, user);

    await this.emailService.sendRecoveryEmail(email, recoverToken);

    return { message: 'E-mail sent succesfully' };
  }

  generateRandomToken() {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  async verifyEmailToken(verifyEmailTokenDto: VerifyEmailTokenDto) {
    const { email, token } = verifyEmailTokenDto;

    const user = await this.userService.findFullUserByWithoutWallet(
      'email',
      email,
    );

    if (!user)
      throw new NotFoundException('Usuário com esse e-mail não encontrado');

    await this.isValidToken(user, token);
    await this.invalidateOTPToken(user);

    return this.generateRecoverPasswordToken(user);
  }

  async invalidateOTPToken(user: User) {
    user.recoverToken = '';
    await this.userService.update(user.id, user);
  }

  async isValidToken(user: User, token: string) {
    const tokenExpiresAt = user.recoverTokenTimestamp;
    tokenExpiresAt.setMinutes(user.recoverTokenTimestamp.getMinutes() + 5);

    if (token != user.recoverToken || new Date() > tokenExpiresAt) {
      await this.notificationService.sendNotification(
        user.id,
        'Erro na alteração de senha',
        `Houve um erro ao tentar alterar sua senha`,
      );
      throw new UnauthorizedException('Token inválido');
    }
  }

  private generateRecoverPasswordToken(user: User): string {
    const payload = {
      sub: user.id,
      login: user.email,
      recoverPassword: true,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.jwtRecoveryExpirationTimeInSeconds,
    });
  }

  async redefinePassword(newPassword: string) {
    const userId = this.userService.extractUserIdFromToken();

    const user = await this.userService.findFullUserByWithoutWallet(
      'id',
      userId,
    );

    if (!user)
      throw new NotFoundException('Usuário com este ID não encontrado.');

    user.loginPassword = this.passwordService.hashPassword(newPassword);
    await this.userService.update(user.id, user);

    await this.notificationService.sendNotification(
      userId,
      'Senha alterada',
      `Sua senha foi modificada`,
    );
  }
}
