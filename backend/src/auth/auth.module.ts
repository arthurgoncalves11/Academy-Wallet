import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '@/src/auth/auth.service';
import { AuthController } from '@/src/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/src/user/user.module';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: Number(process.env.JWT_EXPIRATION_TIME),
        },
      }),
    }),
    forwardRef(() => UserModule),
    CommonModule,
    NotificationModule,
  ],
})
export class AuthModule {}
