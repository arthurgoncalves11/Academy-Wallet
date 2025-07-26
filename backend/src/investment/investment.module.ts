import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { MarketShare } from '../market-share/entities/market-share.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { InvestmentWalletModule } from '../investment-wallet/investment-wallet.module';
import { InvestmentScheduleService } from './schedule/investment-schedule.service';
import { BullModule } from '@nestjs/bullmq';
import { InvestmentProcessor } from './schedule/investment.processor';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, MarketShare, Wallet, Transaction]),
    TransactionModule,
    UserModule,
    InvestmentWalletModule,

    BullModule.registerQueue({
      name: 'investment-queue',
    }),
    NotificationModule,
    UserModule,
  ],
  controllers: [InvestmentController],
  providers: [
    InvestmentService,
    InvestmentScheduleService,
    InvestmentProcessor,
  ],
})
export class InvestmentModule {}
