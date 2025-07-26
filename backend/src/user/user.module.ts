import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from '@/src/wallet/wallet.module';
import { Wallet } from '../wallet/entities/wallet.entity';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    CommonModule,
    NotificationModule,
    forwardRef(() => WalletModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
