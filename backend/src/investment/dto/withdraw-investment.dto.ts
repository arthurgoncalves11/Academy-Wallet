import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class WithdrawInvestmentDto {
  @ApiProperty({
    example: 'd0520cfd-721f-4eb1-8f2f-22f83de83a6a',
    description: 'O ID da carteira do usuário',
    type: String,
    format: 'uuid',
    required: true,
  })
  @IsUUID('4', { message: 'O ID da carteira deve ser um UUID válido' })
  walletId: string;

  @ApiProperty({
    example: '7e7bc5b0-6859-4593-8ab9-4e4236f9d73f',
    description:
      'O ID do fundo de investimento do qual o dinheiro será retirado',
    type: String,
    format: 'uuid',
    required: true,
  })
  @IsUUID('4', {
    message: 'O ID do fundo de investimento deve ser um UUID válido',
  })
  marketShareId: string;

  @ApiProperty({
    example: 50.0,
    description: 'O valor a ser retirado em reais',
    type: Number,
    minimum: 1,
    required: true,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ter no máximo 2 casas decimais' },
  )
  @Min(1, { message: 'O valor a ser retirado deve ser maior que zero' })
  amount: number;

  @ApiProperty({
    example:
      'e7d80ffeefa1b6cd3456789abcdef0123456789abcdef0123456789abcdef0123',
    description: 'Hash da senha de transações (já encriptografada)',
    type: String,
    required: true,
  })
  @IsString({ message: 'A senha de transações deve ser uma string' })
  @IsNotEmpty({ message: 'A senha de transações é obrigatória' })
  transactionsPassword: string;
}
