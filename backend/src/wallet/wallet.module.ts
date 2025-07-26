import { forwardRef, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentAccountModule } from '../current-account/current-account.module';
import { Investment } from '../investment/entities/investment.entity';
import { CurrentAccount } from '../current-account/entities/current-account.entity';
import { CommonModule } from '../common/common.module';
import { InvestmentWalletModule } from '../investment-wallet/investment-wallet.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Investment, CurrentAccount]),
    CurrentAccountModule,
    InvestmentWalletModule,
    CommonModule,
    forwardRef(() => UserModule),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
