import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ListTransactionData {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-01-19T03:00:00.000Z',
    description: 'Data da transação',
  })
  date: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Boleto pago',
    description: 'Descrição da transação',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Marcola',
    description: 'Nome associado à transação',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 100, description: 'Valor da transação' })
  value: number;
}

export class ListTransactionDto {
  @ApiProperty({
    type: ListTransactionData,
    description: 'Dados do usuário',
  })
  data: ListTransactionData[];
}
