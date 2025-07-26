import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResponseDto } from './dto/response-wallet.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import {
  OwnershipGuard,
  SetResourceParam,
} from '../auth/jwt-auth/ownership.guard';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Encontrar uma carteira pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Carteira encontrada com sucesso',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Carteira não encontrada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Wallet not found',
        },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          example: 404,
        },
      },
    },
  })
  @ApiOperation({
    summary:
      'Trazer o nome, o saldo da conta corrente e o saldo total dos investimentos',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados carregados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Dados não encontrados',
  })
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @SetResourceParam('walletId')
  @ApiBearerAuth()
  @Get(':walletId')
  listDataHome(@Param('walletId') id: string) {
    return this.walletService.listDataHome(id);
  }
}
