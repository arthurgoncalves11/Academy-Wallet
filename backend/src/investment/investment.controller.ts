import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentWalletService } from '../investment-wallet/investment-wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { WithdrawInvestmentDto } from './dto/withdraw-investment.dto';
import { AttemptInterceptor } from '../common/middlewares/attempt.interceptor';

@ApiTags('Investments')
@Controller('investment')
export class InvestmentController {
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly investmentWalletService: InvestmentWalletService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo investimento' })
  @ApiResponse({ status: 201, description: 'Investimento criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Entrada invalida.' })
  @ApiResponse({
    status: 404,
    description: 'Carteira ou Investimento não encontrado.',
  })
  @ApiBody({ type: CreateInvestmentDto })
  @ApiBearerAuth()
  @UseInterceptors(AttemptInterceptor)
  create(@Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentService.create(createInvestmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  @ApiOperation({ summary: 'Retirar fundos de um investimento' })
  @ApiResponse({
    status: 200,
    description: 'Retirada realizada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou saldo insuficiente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Investimento não encontrado.',
  })
  @ApiBody({ type: WithdrawInvestmentDto })
  @ApiBearerAuth()
  @UseInterceptors(AttemptInterceptor)
  async withdrawFunds(@Body() withdrawInvestmentDto: WithdrawInvestmentDto) {
    return this.investmentService.withdrawFundsAndNofifyUser(
      withdrawInvestmentDto,
    );
  }

  @Get('summary/:walletId')
  @ApiOperation({
    summary: 'Obter o total investido e disponível para resgate',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumo de investimentos retornado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID da carteira inválido',
  })
  async getInvestmentSummary(@Param('walletId') walletId: string) {
    return this.investmentService.getInvestmentSummary(walletId);
  }

  @Get('wallet-investments/:walletId')
  @ApiOperation({
    summary:
      'Obter todos os investimentos de uma carteira com informações detalhadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Investimentos encontrados com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Investimentos não encontrados',
  })
  @ApiResponse({
    status: 404,
    description: 'Carteira não encontrada para este usuário',
  })
  async getUserInvestments(@Param('walletId') walletId: string) {
    return this.investmentService.getUserInvestments(walletId);
  }
}
