import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class HomeWalletData {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  balanceCurrentAccount: number;
  @IsNotEmpty()
  @IsNumber()
  balanceInvestments: number;
  @IsNotEmpty()
  @IsNumber()
  account: number;
  @IsNotEmpty()
  @IsNumber()
  agency: number;
  @IsNotEmpty()
  @IsNumber()
  organization: number;
  @IsNotEmpty()
  email: string;
}
export class HomeWalletDto {
  @ApiProperty({
    type: HomeWalletData,
    description: 'Dados da home',
  })
  data: HomeWalletData;
}
