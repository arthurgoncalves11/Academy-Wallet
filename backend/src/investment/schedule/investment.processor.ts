import { Processor, WorkerHost } from '@nestjs/bullmq'; // Remova WorkerHost
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InvestmentScheduleService } from './investment-schedule.service';

@Processor('investment-queue')
export class InvestmentProcessor extends WorkerHost {
  private readonly logger = new Logger(InvestmentProcessor.name);

  constructor(
    private readonly investmentScheduleService: InvestmentScheduleService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    //this.logger.log('Update Balance Job started');
    try {
      await this.investmentScheduleService.updateInvestmentBalance();
      //  this.logger.log('Update Balance Job finished');
      return { status: 'success' };
    } catch (error) {
      //   this.logger.error('Update Balance Job failed', error.stack);
      throw error;
    }
  }
}
