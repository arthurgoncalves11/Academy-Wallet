import { Module } from '@nestjs/common';
import { PasswordService } from '@/src/common/services/password.service';
import { EmailService } from './services/email.service';
import { EncryptService } from './services/encrypt.service';
import { AttemptInterceptor } from './middlewares/attempt.interceptor';

@Module({
  providers: [
    PasswordService,
    EmailService,
    EncryptService,
    AttemptInterceptor,
  ],
  exports: [PasswordService, EmailService, EncryptService, AttemptInterceptor],
})
export class CommonModule {}
