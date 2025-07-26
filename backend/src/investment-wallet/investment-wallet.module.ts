import { Module } from '@nestjs/common';
import { InvestmentWalletService } from './investment-wallet.service';
import { InvestmentWalletController } from './investment-wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Investment } from '../investment/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Investment])],
  controllers: [InvestmentWalletController],
  providers: [InvestmentWalletService],
  exports: [InvestmentWalletService],
})
export class InvestmentWalletModule {}
