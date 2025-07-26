import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from '../decorators/login-password-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'senhaSegura123!',
    description: 'Senha de login (mínimo 8 caracteres)',
  })
  @IsValidPassword()
  newPassword: string;
}
