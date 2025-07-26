import { forwardRef, Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([User, Notification]),
    forwardRef(() => UserModule),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
