import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketShareService } from './market-share.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RiskTypes } from './enum/riskTypes';

@ApiTags('Market Shares')
@Controller('market-share')
export class MarketShareController {
  constructor(private readonly marketShareService: MarketShareService) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar Market Shares com base na consulta' })
  @ApiQuery({
    name: 'query',
    required: true,
    description:
      'Consulta para filtrar Market Shares (por nome ou outro critério)',
    type: String,
    example: 'Fundo XYZ',
  })
  @ApiResponse({
    status: 200,
    description: 'Market Shares encontrados',
  })
  @ApiResponse({
    status: 400,
    description: 'Consulta inválida',
  })
  async searchMarketShares(@Query('query') query: string) {
    return this.marketShareService.searchMarketShares(query);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os Market Shares com paginação' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    example: 10,
    description: 'Número de registros por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Market Shares retornada com sucesso',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return this.marketShareService.findAll(Number(page), Number(size));
  }

  @Get('filter-by-risk')
  @ApiOperation({ summary: 'Filtrar Market Shares pelo nível de risco' })
  @ApiQuery({
    name: 'risk',
    required: true,
    enum: Object.values(RiskTypes).filter((v) => isNaN(Number(v))),
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Market Shares filtrados retornada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Nível de risco inválido',
  })
  async findByRisk(@Query('risk') risk: string) {
    return this.marketShareService.findByRisk(risk);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um Market Share pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Market Share encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Market Share não encontrado',
  })
  async findOne(@Param('id') id: string) {
    return this.marketShareService.findOne(id);
  }
}
