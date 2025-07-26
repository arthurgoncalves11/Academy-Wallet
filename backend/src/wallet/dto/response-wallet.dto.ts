import { User } from '@/src/user/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
export class WalletResponseData {
  @ApiProperty({
    description: 'ID da carteira',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'N�mero da ag�ncia',
    example: 1,
  })
  agency: number;

  @ApiProperty({
    description: 'N�mero da conta',
    example: 123456,
  })
  account: number;

  @ApiProperty({
    description: 'N�mero da organiza��o',
    example: 380,
  })
  organization: number;

  @ApiProperty({
    description: 'Informa��es da conta corrente',
    example: { id: '123e4567-e89b-12d3-a456-426614174000', balance: 1000.0 },
  })
  currentAccount: { id: string; balance: number };

  @Exclude()
  @ApiProperty({
    description: 'Senha em hash para transa��es',
    example: '$2b$10$6RpJX8qv5oR3QE8/PtP1XO8frMo6E0TS3h3AM9hGqZHCJF3XgR1Ky',
  })
  transactionsPassword: string;
}

export class WalletResponseDto {
  @ApiProperty({
    type: WalletResponseData,
    description: 'Dados da carteira',
  })
  data: WalletResponseData;
}
