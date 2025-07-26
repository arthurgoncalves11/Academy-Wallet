import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({
    example: 100.0,
    description: 'O valor inicial do investimento em reais',
    type: Number,
    minimum: 1,
    required: true,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor deve ter no máximo 2 casas decimais' },
  )
  @Min(0.01, { message: 'O valor inicial deve ser maior que zero' })
  initialValue: number;

  @ApiProperty({
    example: 'd0520cfd-721f-4eb1-8f2f-22f83de83a6a',
    description: 'O ID da carteira onde o investimento será registrado',
    type: String,
    format: 'uuid',
    required: true,
  })
  @IsUUID('4', { message: 'O ID da carteira deve ser um UUID válido' })
  walletId: string;

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

  @ApiProperty({
    example: '73fadb66-5ac3-469c-a425-1392c72ccaf8',
    description: 'O ID do fundo de investimento selecionado',
    type: String,
    format: 'uuid',
    required: true,
  })
  @IsUUID('4', { message: 'O ID do fundo deve ser um UUID válido' })
  marketShareId: string;
}
