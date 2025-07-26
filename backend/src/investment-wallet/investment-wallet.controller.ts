import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvestmentWalletService } from './investment-wallet.service';

@Controller('investment-wallet')
export class InvestmentWalletController {
  constructor(
    private readonly investmentWalletService: InvestmentWalletService,
  ) {}
}
