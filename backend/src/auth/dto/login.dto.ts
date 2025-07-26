import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'E-mail válido',
  })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @ApiProperty({
    example: 'Senhaboa#1',
    description: 'Senha de login',
  })
  @IsString()
  @MinLength(5, { message: 'A senha deve ter no mínimo 5 caracteres.' })
  @MaxLength(50, { message: 'A senha deve ter no máximo 50 caracteres.' })
  password: string;
}
