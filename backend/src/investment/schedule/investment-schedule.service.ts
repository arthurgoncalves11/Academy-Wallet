import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Investment } from '../entities/investment.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { Queue } from 'bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import Decimal from 'decimal.js';

@Injectable()
export class InvestmentScheduleService {
  private readonly logger = new Logger(InvestmentScheduleService.name);
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectQueue('investment-queue')
    private investmentQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleInvestmentBalanceUpdate() {
    // this.logger.log('CRON JOB STARTED');
    const job = await this.investmentQueue.add(
      'updateBalance',
      {},
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }

  async updateInvestmentBalance() {
    // this.logger.log('chamou o metodo');
    const investments = await this.investmentRepository.find({
      relations: ['marketShares'],
    });

    if (investments.length === 0) {
      this.logger.log('No investments found');
      return;
    }

    //  this.logger.log(`Achou ${investments.length} investments`);

    for (const investment of investments) {
      if (!investment.marketShares || investment.marketShares.length === 0) {
        // this.logger.warn(`Investimos ${investment.id} nao tem market shares`);
        continue;
      }

      const marketShare = investment.marketShares[0];
      if (marketShare) {
        // this.logger.log(`Valor anterios: ${investment.balance}`);
        // this.logger.log(`Taxa: ${marketShare.dayYield}`);

        const newBalance = new Decimal(investment.balance)
          .plus(
            new Decimal(investment.balance).times(marketShare.dayYield / 100),
          )
          .toNumber();

        investment.balance = newBalance;
        // this.logger.log(`New balance: ${investment.balance}`);
      }
    }

    await this.investmentRepository.save(investments);
  }
}
