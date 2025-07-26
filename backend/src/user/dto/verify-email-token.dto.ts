import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyEmailTokenDto {
  @ApiProperty({
    example: '6548',
    description: 'Token de recuperação de senha',
  })
  @IsString()
  @IsNotEmpty({ message: 'O token de recuperação de senha é ogrigatório.' })
  @Matches(/^\d{4}$/, {
    message:
      'O token de recuperação de senha deve conter exatamente 4 dígitos.',
  })
  token: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;
}
