import { Module } from '@nestjs/common';
import { CurrentAccountService } from './current-account.service';
import { CurrentAccountController } from './current-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentAccount } from './entities/current-account.entity';

@Module({
  controllers: [CurrentAccountController],
  providers: [CurrentAccountService],
  imports: [TypeOrmModule.forFeature([CurrentAccount])],
  exports: [CurrentAccountService],
})
export class CurrentAccountModule {}
