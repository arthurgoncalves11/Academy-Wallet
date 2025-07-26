import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketShare } from './entities/market-share.entity';
import { isUUID } from 'class-validator';
import { RiskTypes } from './enum/riskTypes';

@Injectable()
export class MarketShareService {
  private readonly logger = new Logger(MarketShareService.name);

  constructor(
    @InjectRepository(MarketShare)
    private readonly marketShareRepository: Repository<MarketShare>,
  ) {}

  async searchMarketShares(query: string) {
    try {
      const marketShares = await this.marketShareRepository
        .createQueryBuilder('marketShare')
        .where('marketShare.name ILIKE :query', { query: `%${query}%` })
        .getMany();

      return {
        data: marketShares,
        message: 'Market shares encontrados com sucesso',
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar market shares: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Erro ao buscar market shares');
    }
  }

  async findByRisk(risk: string, page: number = 1, size: number = 10) {
    const formattedRisk = risk.trim().toUpperCase();
    const validRisks = Object.values(RiskTypes);

    if (!validRisks.includes(formattedRisk as RiskTypes)) {
      throw new BadRequestException(
        `O risco fornecido (${formattedRisk}) é inválido. Valores válidos: ${validRisks.join(', ')}`,
      );
    }

    const skip = (page - 1) * size;

    const [data, total] = await this.marketShareRepository.findAndCount({
      where: { risk: formattedRisk as RiskTypes },
      take: size,
      skip,
    });

    return {
      data: {
        data,
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
      message: `Market shares com risco ${formattedRisk} encontrados com sucesso`,
    };
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `O ID fornecido (${id}) não é um UUID válido.`,
      );
    }

    const marketShare = await this.marketShareRepository.findOne({
      where: { id },
    });

    if (!marketShare) {
      throw new NotFoundException(`Market Share com ID ${id} não encontrado`);
    }

    return {
      data: marketShare,
      message: `Market Share com ID ${id} encontrado com sucesso`,
    };
  }

  async findAll(page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;

    try {
      const [data, total] = await this.marketShareRepository.findAndCount({
        take: size,
        skip,
      });

      return {
        data: {
          data,
          total,
          page,
          size,
          totalPages: Math.ceil(total / size),
        },
        message: 'Lista de market shares carregada com sucesso',
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar market shares: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Erro ao buscar market shares');
    }
  }
}
