import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaidSlipsService } from './paid-slips.service';
import { CreatePaidSlipDto } from './dto/create-paid-slip.dto';
import { JwtAuthGuard } from '@/src/auth/jwt-auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { returnSlipDto } from '@/src/paid-slips/dto/return-slip.dto';
import { AttemptInterceptor } from '../common/middlewares/attempt.interceptor';

@Controller('paid-slips')
export class PaidSlipsController {
  constructor(private readonly paidSlipsService: PaidSlipsService) {}

  @UseInterceptors(AttemptInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria um pagamento de boleto',
    description:
      'Realiza o pagamento imediato se for dia útil ou paga no próximo dia útil',
  })
  @ApiBody({
    type: CreatePaidSlipDto,
    examples: {
      exemplo1: {
        summary: 'Exemplo de pagamento de boleto',
        value: {
          barcode: '34191751243456787123041234560005199890000015000',
          name: 'João Silva',
          transactionPassword: 'senha criptografada',
          value: 150.75,
          walletId: 'id da carteira válido',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Resposta para pagamento processado',
    content: {
      'application/json': {
        examples: {
          pagamentoConcluido: {
            summary: 'Pagamento concluído',
            value: {
              timestamp: '2025-02-11T12:15:06.636Z',
              statusCode: 201,
              error: false,
              message: 'Pagamento concluído com sucesso!',
              data: {
                barcode: 'codigo de barras',
                id: 'id do boleto pago',
              },
            },
          },
          pagamentoAgendado: {
            summary: 'Pagamento aguardando compensação',
            value: {
              timestamp: '2025-02-11T12:15:06.636Z',
              statusCode: 201,
              error: false,
              message: 'Pagamento aguardando compensação',
              data: null,
              count: null,
              totalCount: null,
            },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Dados inválidos na requisição',
    schema: {
      example: {
        statusCode: 409,
        message: 'Codigo invalido',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou expirado | Senha transacional incorreta',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido ou expirado | Senha transacional incorreta',
        error: true,
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflito na operação',
    content: {
      'application/json': {
        examples: {
          boletoPago: {
            summary: 'Boleto já está pago',
            value: {
              statusCode: 409,
              message: 'Boleto já está pago',
              error: true,
            },
          },
          saldoInsuficiente: {
            summary: 'Saldo insuficiente',
            value: {
              statusCode: 409,
              message: 'Saldo insuficiente na carteira',
              error: true,
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Carteira não encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Carteira não encontrada',
        error: true,
      },
    },
  })
  create(@Body() createPaidSlipDto: CreatePaidSlipDto) {
    return this.paidSlipsService.create(createPaidSlipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/pendent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar boletos pendentes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletos pendentes.',
    content: {
      'application/json': {
        examples: {
          boletosEncontrados: {
            summary: 'Boletos pendentes encontrados',
            value: {
              timestamp: '2025-02-15T18:31:39.103Z',
              statusCode: 200,
              error: false,
              message: null,
              count: 1,
              totalCount: 1,
              data: [
                {
                  id: '2849dcec-8169-4861-af39-63227c77515f',
                  barcode: '00199999500000011110000003406098002922618717',
                  name: 'Arthur Santos',
                  value: '11.11',
                  walletId: 'fc349c1c-fff5-4d0a-9971-873961c7d456',
                },
              ],
            },
          },
          nenhumBoleto: {
            summary: 'Nenhum boleto pendente encontrado',
            value: {
              timestamp: '2025-02-15T18:31:39.103Z',
              statusCode: 200,
              error: false,
              message: null,
              count: 0,
              totalCount: 0,
              data: [],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido ou expirado',
        error: true,
      },
    },
  })
  getSlipPendent() {
    return this.paidSlipsService.findSlipsPendent();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca um boleto bancário pelo código digitado' })
  @ApiParam({
    name: 'code',
    type: Number,
    description: 'Código do boleto bancário',
    required: true,
    example: 'deve ter 44 ou 47 digitos',
  })
  @ApiResponse({
    status: 200,
    description: 'Boleto achado com sucesso',
    type: returnSlipDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Boleto não encontrado',
    content: {
      'application/json': {
        example: {
          message: 'Boleto nao encontrado!',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Boleto expirado',
    content: {
      'application/json': {
        example: {
          message: 'Boleto expirado!',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou expirado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido ou expirado',
        error: true,
      },
    },
  })
  getSlip(@Param('code') code: string) {
    return this.paidSlipsService.findBankSlip(code);
  }
}
