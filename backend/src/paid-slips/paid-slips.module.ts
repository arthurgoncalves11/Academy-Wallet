import { Module } from '@nestjs/common';
import { PaidSlipsService } from './paid-slips.service';
import { PaidSlipsController } from './paid-slips.controller';
import { PaidSlip } from '@/src/paid-slips/entities/paid-slip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '@/src/transaction/transaction.module';
import { UserModule } from '@/src/user/user.module';
import { SlipPendent } from '@/src/paid-slips/entities/slipPendent.entity';
import { BullModule } from '@nestjs/bullmq';
import { PaidSlipProcessor } from '@/src/paid-slips/schedule/paid-slip.processor';
import { PaidSlipScheduleService } from '@/src/paid-slips/schedule/paid-slip.schedule.service';
import { PaidSlipPendentService } from '@/src/paid-slips/paid-slip-pendent.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Wallet } from '@/src/wallet/entities/wallet.entity';
import { WalletService } from '@/src/wallet/wallet.service';
import { PasswordService } from '@/src/common/services/password.service';
import { CurrentAccountService } from '@/src/current-account/current-account.service';
import { InvestmentWalletService } from '@/src/investment-wallet/investment-wallet.service';
import { CurrentAccount } from '@/src/current-account/entities/current-account.entity';
import { Investment } from '@/src/investment/entities/investment.entity';
import { WalletModule } from '@/src/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaidSlip,
      SlipPendent,
      Transaction,
      Wallet,
      CurrentAccount,
      Investment,
    ]),
    TransactionModule,
    UserModule,
    TransactionModule,
    WalletModule,
    BullModule.registerQueue({
      name: 'paidSlip-queue',
    }),
  ],
  controllers: [PaidSlipsController],
  providers: [
    PaidSlipsService,
    WalletService,
    PasswordService,
    CurrentAccountService,
    InvestmentWalletService,
    PaidSlipPendentService,
    PaidSlipProcessor,
    PaidSlipScheduleService,
  ],
  exports: [PaidSlipsService],
})
export class PaidSlipsModule {
}
