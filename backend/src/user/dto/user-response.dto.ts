import { WalletResponseDto } from '@/src/wallet/dto/response-wallet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserData {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único do usuário',
  })
  id: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({
    example: '529.982.247-25',
    description: 'CPF do usuário',
  })
  cpf: string;

  @ApiProperty({
    example: 'MG-1234567',
    description: 'RG do usuário',
  })
  rg: string;

  @ApiProperty({
    example: false,
    description: 'Indica se é o primeiro acesso do usuário',
  })
  firstAccess: boolean;

  @ApiProperty({
    type: WalletResponseDto,
    description: 'Carteira associada ao usuário',
  })
  @Type(() => WalletResponseDto)
  wallet: WalletResponseDto;
}

export class UserResponseDto {
  @ApiProperty({
    type: UserData,
    description: 'Dados do usuário',
  })
  data: UserData;
}
