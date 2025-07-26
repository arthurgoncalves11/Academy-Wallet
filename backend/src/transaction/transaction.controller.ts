import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListTransactionDto } from './dto/list-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import {
  OwnershipGuard,
  SetResourceParam,
} from '../auth/jwt-auth/ownership.guard';
import { GetCryptKeyDto } from './dto/get-crypt-key.dto';
import { publicEncrypt } from 'node:crypto';
import { AttemptInterceptor } from '../common/middlewares/attempt.interceptor';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @SetResourceParam('walletId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém todas as movimentações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas as movimentações',
    type: [ListTransactionDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição inválida',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @Get('/all/:walletId')
  findAll(@Param('walletId') id: string) {
    return this.transactionService.findTransactions(id);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @SetResourceParam('walletId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém as ultimas 5 movimentações' })
  @ApiResponse({
    status: 200,
    description: 'Lista das ultimas 5 movimentações',
    type: [ListTransactionDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de requisição inválida',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @Get(':walletId')
  findLastFive(@Param('walletId') id: string) {
    return this.transactionService.findTransactions(id, 5);
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @SetResourceParam('walletId')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Procura as movimentações dentro de um periodo de 7/15/30/60/90 dias ou todas',
  })
  @ApiParam({
    name: 'days',
    type: Number,
    description: 'Número de dias para filtrar as movimentações',
    required: true,
    enum: [-1, 7, 15, 30, 60, 90],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista todas as movimentações dentro de um periodo de tempo',
    type: [ListTransactionDto],
  })
  @ApiResponse({
    status: 400,
    description:
      'Erro de requisição inválida (exemplo: parâmetro "days" inválido)',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhuma movimentação encontrada para o período informado',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @Get('/filtro/:walletId/:days')
  findByPeriod(@Param('walletId') id: string, @Param('days') days: number) {
    return this.transactionService.findTransactionsInPeriodTime(id, days);
  }

  @UseInterceptors(AttemptInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria uma nova transação',
    description:
      'Registra uma nova movimentação financeira. Se for um débito (CREDIT), verifica se há saldo suficiente antes de processar a transação.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: CreateTransactionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida (exemplo: saldo insuficiente)',
  })
  @ApiResponse({
    status: 404,
    description: 'Carteira não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao processar a transação',
  })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/crypt/key')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pega chave exclusiva de encriptação',
    description: 'Retorna a chave.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chave de encriptografia retornada',
    type: GetCryptKeyDto,
  })
  async getCryptKey(): Promise<GetCryptKeyDto> {
    return await this.transactionService.getEncryptKey();
  }

  //REMOVER
  @Post('/encrypt_password')
  encryptTransactionsPassword(
    @Body() publicKeyDto: { publicKey: string; password: string },
  ) {
    const { publicKey, password } = publicKeyDto;
    return {
      data: {
        passwordEncrypted: publicEncrypt(
          publicKey,
          Buffer.from(password, 'utf8'),
        ).toString('base64'),
      },
    };
  }
}
