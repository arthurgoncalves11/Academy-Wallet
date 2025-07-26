import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SlipPendent } from '@/src/paid-slips/entities/slipPendent.entity';
import ehDiaUtil from 'eh-dia-util-slim';
import { CreateTransactionDto } from '@/src/transaction/dto/create-transaction.dto';
import { transactionType } from '@/src/transaction/enum/transactionType';
import { PaidSlipPendentService } from '@/src/paid-slips/paid-slip-pendent.service';
import { PaidSlip } from '@/src/paid-slips/entities/paid-slip.entity';

@Injectable()
export class PaidSlipScheduleService {
  constructor(
    @InjectRepository(SlipPendent)
    private readonly slipPendentRepository: Repository<SlipPendent>,
    @InjectRepository(PaidSlip)
    private readonly paidSlipRepository: Repository<PaidSlip>,
    @InjectQueue('paidSlip-queue')
    private paidSlipQueue: Queue,
    private readonly paidSlipPendentService: PaidSlipPendentService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async schedulePaidSlipUpdate() {
    const job = await this.paidSlipQueue.add(
      'updateSlipPendent',
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

  getNextBusinessDay(date = new Date()) {
    if (!ehDiaUtil(date)) {
      date.setDate(date.getDate() + 1);
      return this.getNextBusinessDay(date);
    }
    return date;
  }

  async updatePaidSlipBalance() {
    const slipsPendents = await this.slipPendentRepository.find();
    if (slipsPendents.length === 0) {
      return;
    }

    for (const slipPendent of slipsPendents) {
      const currentDate = new Date();
      const businessDate = this.getNextBusinessDay(new Date(currentDate));
      if (currentDate.getDate() == businessDate.getDate()) {
        const createTransaction: CreateTransactionDto = {
          description: 'Boleto',
          name: slipPendent.name,
          type: transactionType.DEBIT,
          value: slipPendent.value,
          walletId: slipPendent.walletId,
          transactionsPassword: '',
        };
        await this.paidSlipPendentService.create(createTransaction);
        const paidSlip = this.paidSlipRepository.create(slipPendent);
        await this.paidSlipRepository.save(paidSlip);
        await this.slipPendentRepository.delete(slipPendent);
      }
    }
  }
}
