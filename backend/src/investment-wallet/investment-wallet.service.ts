import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Investment } from '../investment/entities/investment.entity';

@Injectable()
export class InvestmentWalletService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async getInvestmentSummary(userId: string) {
    try {
      const formattedUserId = userId.trim();

      if (!isUUID(formattedUserId)) {
        throw new BadRequestException(
          `O ID do usuário (${formattedUserId}) não é um UUID válido.`,
        );
      }

      const wallet = await this.walletRepository.findOne({
        where: { user: { id: formattedUserId } },
      });

      if (!wallet) {
        throw new NotFoundException(
          'Carteira não encontrada para este usuário.',
        );
      }

      const totalInvested = await this.investmentRepository
        .createQueryBuilder('investment')
        .select('COALESCE(SUM(investment.initialValue), 0)', 'total')
        .where('investment.wallet = :walletId', { walletId: wallet.id })
        .getRawOne();

      const totalAvailableForRedemption = await this.investmentRepository
        .createQueryBuilder('investment')
        .select('COALESCE(SUM(investment.balance), 0)', 'total')
        .where('investment.wallet = :walletId', { walletId: wallet.id })
        .getRawOne();

      return {
        totalInvested: Number(totalInvested?.total || 0),
        totalAvailableForRedemption: Number(
          totalAvailableForRedemption?.total || 0,
        ),
      };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao processar a requisição.');
    }
  }
}
