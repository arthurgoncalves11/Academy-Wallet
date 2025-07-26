import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PaidSlipScheduleService } from '@/src/paid-slips/schedule/paid-slip.schedule.service';
import logger from 'logger';

@Processor('paidSlip-queue')
export class PaidSlipProcessor extends WorkerHost {
  constructor(
    private readonly paidSlipScheduleService: PaidSlipScheduleService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    try {
      await this.paidSlipScheduleService.updatePaidSlipBalance();
      return { status: 'success' };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
