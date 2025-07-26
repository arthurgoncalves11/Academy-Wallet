import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsCPF } from '@/src/user/decorators/cpf-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from '../decorators/login-password-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @Length(3, 150, { message: 'O nome deve ter entre 3 e 150 caracteres' })
  @Matches(/^[a-zA-Z\u00C0-\u017F´]+(?: [a-zA-Z\u00C0-\u017F´]+)+$/, {
    message: 'O nome deve conter apenas letras e espaços.',
  })
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123!',
    description: 'Senha de login (mínimo 8 caracteres)',
  })
  @IsValidPassword()
  loginPassword: string;

  @ApiProperty({
    example: '52998224725',
    description: 'CPF válido',
  })
  @IsCPF({ message: 'O CPF informado não é válido.' })
  cpf: string;

  @ApiProperty({
    example: '1234567',
    description: 'RG (7 a 14 dígitos alfanuméricos)',
  })
  @IsString()
  @IsNotEmpty({ message: 'O RG é obrigatório.' })
  @Length(7, 14, { message: 'O RG deve ter entre 7 a 14 dígitos numéricos' })
  @Matches(/^[a-zA-Z0-9]{7,10}$/, {
    message: 'O RG deve conter apenas letras e números, com 7 a 10 caracteres.',
  })
  rg: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha de transações (6 dígitos numéricos)',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha de transações é obrigatória.' })
  @Matches(/^\d{6}$/, {
    message: 'A senha de transações deve conter exatamente 6 dígitos.',
  })
  transactionsPassword: string;
}
