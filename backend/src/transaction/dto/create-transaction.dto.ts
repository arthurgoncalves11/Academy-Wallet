import { transactionType } from '@/src/transaction/enum/transactionType';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Tipo da transação',
    enum: transactionType,
    example: transactionType.DEBIT,
  })
  @IsEnum(transactionType, { message: 'O tipo de transação é inválido.' })
  @IsNotEmpty({ message: 'O tipo de transação é obrigatório.' })
  type: transactionType;

  @ApiProperty({
    description: 'Valor da transação',
    example: 100.5,
  })
  @IsNumber({}, { message: 'O valor deve ser um número válido.' })
  @IsNotEmpty({ message: 'O valor da transação é obrigatório.' })
  value: number;

  @ApiProperty({
    description: 'Data da transação',
    example: '2024-02-05T12:00:00Z',
    required: false,
  })
  @IsOptional()
  date?: Date;

  @ApiProperty({
    description: 'Descrição da transação',
    example: 'Compra de material de escritório',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;

  @ApiProperty({
    description: 'Nome da transação',
    example: 'Deposito',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @ApiProperty({
    description: 'Id da carteira associada à transação',
  })
  @IsUUID('4', { message: 'O UUID deve ser valido' })
  @IsNotEmpty({ message: 'O UUID deve ser valido' })
  walletId: string;

  @ApiProperty({
    description: 'senha de transações',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha de transações é obrigatória.' })
  transactionsPassword: string;

  constructor(partial: Partial<CreateTransactionDto>) {
    Object.assign(this, partial);
  }
}
