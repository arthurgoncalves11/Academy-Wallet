import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '@/src/wallet/entities/wallet.entity';
import { WalletModule } from '@/src/wallet/wallet.module';
import { CurrentAccount } from '@/src/current-account/entities/current-account.entity';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { CurrentAccountModule } from '../current-account/current-account.module';
import { Investment } from '../investment/entities/investment.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Wallet, Investment, CurrentAccount]),
    WalletModule,
    UserModule,
    CommonModule,
    CurrentAccountModule,
    NotificationModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
