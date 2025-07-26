import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaidSlipDto {
  @ApiProperty({
    description: 'Código de barras do boleto',
    example: '12345678901234567890',
  })
  @IsString()
  @IsNotEmpty({ message: 'O código de barras é obrigatório' })
  barcode: string;

  @ApiProperty({ description: 'Nome do pagador', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Senha de transação', example: 's3nh4S3gur4' })
  @IsString()
  @IsNotEmpty()
  transactionPassword: string;

  @ApiProperty({ description: 'Valor do pagamento', example: 150.75 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    description: 'UUID da carteira associada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'O UUID deve ser válido' })
  @IsNotEmpty({ message: 'O UUID deve ser válido' })
  walletId: string;
}
