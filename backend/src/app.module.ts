import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentAccountModule } from './current-account/current-account.module';
import { InvestmentModule } from './investment/investment.module';
import { MarketShareModule } from './market-share/market-share.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { InvestmentWalletModule } from './investment-wallet/investment-wallet.module';
import { PaidSlipsModule } from './paid-slips/paid-slips.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { FirebaseModule } from './firebase/firebase.module';
import { CacheModule } from '@nestjs/cache-manager';

import * as redisStore from 'cache-manager-redis-store';
import { AppDataSource } from './config/dataSource';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    WalletModule,
    CurrentAccountModule,
    InvestmentModule,
    MarketShareModule,
    NotificationModule,
    TransactionModule,
    PaidSlipsModule,
    TypeOrmModule.forRoot(AppDataSource.options),

    InvestmentWalletModule,

    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: 6379,
      ttl: 600,
    }),
    FirebaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
