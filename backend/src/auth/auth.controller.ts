import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthResponseDto } from '@/src/auth/dto/auth.dto';
import { AuthService } from '@/src/auth/auth.service';
import { LoginDto } from '@/src/auth/dto/login.dto';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EmailDto } from '../user/dto/email.dto';
import { VerifyEmailTokenDto } from '../user/dto/verify-email-token.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { RecoveryAuthGuard } from './jwt-auth/recover-auth.guard';
import { AttemptInterceptor } from '../common/middlewares/attempt.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(AttemptInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Faz o login de um usuário',
    description:
      'Cria um usuário com e-mail, senha, CPF, RG e senha de transações.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NWVlNzg2OS0zYzRlLTQ4NDctYjRiZC0xMTRiNDVkODRhZTUiLCJsb2dpbiI6ImpvaG5AZ21haWwuY29tIiwiaWF0IjoxNzM4MjYzOTIxLCJleHAiOjE3MzgyNjc1MjF9.AS4jUjhRsVLBxp3ZeGSs6QE3xNwigPcxpiOz2AjRSDo',
        expiresIn: 3600,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais invállidas.',
  })
  async signIn(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    return await this.authService.signIn(email, password);
  }

  @Post('/request-otp')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Solicitar redefinição de senha',
    description:
      'Envia um código OTP por e-mail para redefinir a senha do usuário.',
  })
  @ApiBody({ type: EmailDto })
  @ApiResponse({
    status: 200,
    description: 'E-mail de redefinição enviado com sucesso',
    schema: { example: { message: 'E-mail sent successfully' } },
  })
  @ApiNotFoundResponse({
    description: 'E-mail não cadastrado',
  })
  async activeRedefinePassword(
    @Body() { email }: EmailDto,
  ): Promise<{ message: string }> {
    return await this.authService.activeRedefinePassword(email);
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Valida código OTP enviado por e-mail',
    description:
      'Valida o código OTP enviado por e-mail, e devolve um token de autenticação para redefinição de senha',
  })
  @ApiBody({ type: EmailDto })
  @ApiResponse({
    status: 200,
    description:
      'Código validado com sucesso e token de recuperação de senha retornado',
    schema: {
      example: {
        message: 'Token validado com sucesso',
        data: {
          recoverPasswordToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOGYwM2NlYS1jZWM1LTQyYmItOWYyZS1iYmM1Y2YxOTJmNGEiLCJsb2dpbiI6InB2c2NhcmVsbGlAZ21haWwuY29tIiwicmVjb3ZlclBhc3N3b3JkIjp0cnVlLCJpYXQiOjE3Mzk0NjMxMjksImV4cCI6MTczOTQ2MzcyOX0.TWQU33mZ-HFCwXVDLwEBe1_C329vJl9aSxtYzFfahvo',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido',
  })
  @ApiForbiddenResponse({
    description:
      'Limite de tentativas excedido, endpoint bloqueado para este IP por 10 minutos',
  })
  @UseInterceptors(AttemptInterceptor)
  @Post('/validate-otp')
  async verifyEmailToken(@Body() verifyEmailTokenDto: VerifyEmailTokenDto) {
    return {
      message: 'Token validado com sucesso',
      data: {
        recoverPasswordToken:
          await this.authService.verifyEmailToken(verifyEmailTokenDto),
      },
    };
  }

  @UseGuards(RecoveryAuthGuard)
  @Patch('/change-password')
  @ApiOperation({
    summary: 'Redefinir senha do usuário',
    description:
      'Redefine a senha do usuário com o token recebido na validação do código OTP.',
  })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    schema: { example: { message: 'Password changed' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou usuário não encontrado',
  })
  async redefinePassword(
    @Body()
    { newPassword }: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.redefinePassword(newPassword);

    return { message: 'Password changed' };
  }
}
