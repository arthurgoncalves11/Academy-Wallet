import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketShare } from './entities/market-share.entity';
import { MarketShareService } from './market-share.service';
import { MarketShareController } from './market-share.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MarketShare])],
  controllers: [MarketShareController],
  providers: [MarketShareService],
  exports: [MarketShareService],
})
export class MarketShareModule {}
