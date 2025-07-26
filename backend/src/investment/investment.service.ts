import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { In, Repository } from 'typeorm';
import { MarketShare } from '../market-share/entities/market-share.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { TransactionService } from '../transaction/transaction.service';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';
import { transactionType } from '../transaction/enum/transactionType';
import { isUUID } from 'class-validator';
import { WithdrawInvestmentDto } from './dto/withdraw-investment.dto';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(MarketShare)
    private readonly marketShareRepository: Repository<MarketShare>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto) {
    const userId = this.userService.extractUserIdFromToken();
    try {
      await this.makeInvestment(createInvestmentDto);
    } catch (error) {
      await this.notificationService.sendNotification(
        userId,
        'Erro no investimento',
        'Houve um erro ao realizar o seu investimento',
      );
      throw error;
    }

    await this.notificationService.sendNotification(
      userId,
      'Investimento efetuado',
      `Investimento realizado com sucesso`,
    );

    return { message: 'Investimento efetuado com sucesso' };
  }

  async makeInvestment(createInvestmentDto: CreateInvestmentDto) {
    if (
      !isUUID(createInvestmentDto.marketShareId) ||
      !isUUID(createInvestmentDto.walletId)
    ) {
      throw new BadRequestException('ID inválido');
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: createInvestmentDto.walletId },
      relations: ['currentAccount', 'investments', 'user'],
    });

    if (!wallet) {
      throw new NotFoundException('carteira não encontrada');
    }

    if (isNaN(createInvestmentDto.initialValue)) {
      throw new BadRequestException('Valor de investimento inválido');
    }

    if (wallet.currentAccount.balance < createInvestmentDto.initialValue) {
      throw new BadRequestException('Saldo insuficiente na conta corrente');
    }

    const marketShare = await this.marketShareRepository.findOne({
      where: { id: createInvestmentDto.marketShareId },
    });

    if (!marketShare) {
      throw new NotFoundException('Fundo não encontrado');
    }

    if (createInvestmentDto.initialValue <= 0) {
      throw new BadRequestException('Valor de investimento inválido');
    }

    if (createInvestmentDto.initialValue < marketShare.minDeposit) {
      throw new BadRequestException(
        'Valor de investimento abaixo do mínimo, mínimo: ' +
          marketShare.minDeposit,
      );
    }

    const extractRedemptionDays = (redemption: string): number => {
      const match = redemption.match(/D\+(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    const redemptionDays = extractRedemptionDays(marketShare.redemption);

    const transaction = new CreateTransactionDto({
      value: createInvestmentDto.initialValue,
      type: transactionType.DEBIT,
      walletId: wallet.id,
      name: 'Investimento',
      transactionsPassword: createInvestmentDto.transactionsPassword,
      description: 'Investimento em ações',
    });

    await this.transactionService.makeTransaction(transaction);

    const investiment = this.investmentRepository.create({
      initialValue: createInvestmentDto.initialValue,
      balance: createInvestmentDto.initialValue,
      acquiredAt: new Date(),
      availableAt: new Date(
        new Date().setDate(new Date().getDate() + redemptionDays),
      ),
      isActive: true,
      wallet: wallet,
      marketShares: [marketShare],
    });

    await this.investmentRepository.save(investiment);
  }

  async withdrawFundsAndNofifyUser(
    withdrawInvestmentDto: WithdrawInvestmentDto,
  ) {
    const userId = this.userService.extractUserIdFromToken();
    try {
      await this.withdrawFunds(withdrawInvestmentDto);
    } catch (error) {
      await this.notificationService.sendNotification(
        userId,
        'Erro no resgate de investimento',
        'Houve um erro ao realizar o resgate de seu investimento',
      );
      throw error;
    }

    await this.notificationService.sendNotification(
      userId,
      'Resgate de investimento',
      'Resgate de investimento efetuado com sucesso',
    );

    return {
      message: 'Resgate de investimento efetuado com sucesso',
    };
  }

  async withdrawFunds(withdrawInvestmentDto: WithdrawInvestmentDto) {
    const { walletId, amount, marketShareId, transactionsPassword } =
      withdrawInvestmentDto;

    if (!isUUID(walletId) || !isUUID(marketShareId)) {
      throw new BadRequestException(
        'ID da carteira ou do fundo de investimento inválido.',
      );
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['currentAccount', 'user'],
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Valor de retirada inválido.');
    }

    const investments = await this.investmentRepository
      .createQueryBuilder('investment')
      .innerJoin('investment.marketShares', 'marketShare')
      .where('investment.wallet = :walletId', { walletId })
      .andWhere('marketShare.id = :marketShareId', { marketShareId })
      .andWhere('investment.availableAt <= CURRENT_DATE')
      .andWhere('investment.isActive = true')
      .orderBy('investment.acquiredAt', 'ASC')
      .getMany();

    if (!investments.length) {
      throw new BadRequestException('Nenhum saldo disponível para resgate.');
    }

    const totalAvailableForMarketShare = investments.reduce(
      (sum, inv) => sum + inv.balance,
      0,
    );

    if (amount > totalAvailableForMarketShare) {
      throw new BadRequestException(
        'Saldo insuficiente disponível para resgate neste fundo.',
      );
    }

    let remainingAmount = amount;
    const investmentsToUpdate: Investment[] = [];

    for (const investment of investments) {
      if (remainingAmount <= 0) break;

      const amountToWithdraw = Math.min(remainingAmount, investment.balance);
      investment.balance -= amountToWithdraw;
      remainingAmount -= amountToWithdraw;

      if (investment.balance <= 0) {
        investment.isActive = false;
      }

      investmentsToUpdate.push(investment);
    }

    if (investmentsToUpdate.length > 0) {
      await this.investmentRepository.save(investmentsToUpdate);
    }

    const transaction = new CreateTransactionDto({
      value: amount,
      type: transactionType.CREDIT,
      walletId: wallet.id,
      name: 'Resgate de Investimento',
      description: `Resgate de ${amount} reais do fundo ${marketShareId}`,
      transactionsPassword: transactionsPassword,
    });

    await this.transactionService.makeTransaction(transaction);
  }

  async getInvestmentSummary(walletId: string) {
    const formattedWalletId = walletId.trim();

    if (!isUUID(formattedWalletId)) {
      throw new BadRequestException(
        `O ID da carteira (${formattedWalletId}) não é um UUID válido.`,
      );
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: formattedWalletId },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    const totalInvested = await this.investmentRepository
      .createQueryBuilder('investment')
      .select('COALESCE(SUM(investment.balance), 0)', 'total')
      .where('investment.wallet = :walletId', { walletId: wallet.id })
      .andWhere('investment.isActive = true')
      .getRawOne();

    const totalAvailableForRedemption = await this.investmentRepository
      .createQueryBuilder('investment')
      .select('COALESCE(SUM(investment.balance), 0)', 'total')
      .where('investment.wallet = :walletId', { walletId: wallet.id })
      .andWhere('investment.availableAt <= CURRENT_DATE')
      .andWhere('investment.isActive = true')
      .getRawOne();

    return {
      data: {
        totalInvested: Number(totalInvested?.total || 0),
        totalAvailableForRedemption: Number(
          totalAvailableForRedemption?.total || 0,
        ),
      },
      message: 'Resumo de investimentos carregado com sucesso',
    };
  }

  async getUserInvestments(walletId: string) {
    if (!isUUID(walletId.trim())) {
      throw new BadRequestException(
        `O ID da carteira (${walletId}) não é válido.`,
      );
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: walletId.trim() },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    const investments = await this.investmentRepository
      .createQueryBuilder('investment')
      .innerJoin('investment.marketShares', 'marketShare')
      .where('investment.wallet = :walletId', { walletId: wallet.id })
      .andWhere('investment.isActive = true')
      .select([
        'marketShare.id AS "marketShareId"',
        'COALESCE(CAST(SUM(investment.balance) AS DECIMAL), 0) AS "totalInvested"',
        'COALESCE(CAST(SUM(CASE WHEN investment.availableAt <= CURRENT_DATE THEN investment.balance ELSE 0 END) AS DECIMAL), 0) AS "totalAvailableForRedemption"',
      ])
      .groupBy('marketShare.id')
      .getRawMany();

    const marketShares = await this.marketShareRepository.find({
      where: { id: In(investments.map((i) => i.marketShareId)) },
    });

    return {
      data: investments.map((investment) => {
        const share = marketShares.find(
          (ms) => ms.id === investment.marketShareId,
        );

        const totalInvested =
          Number(investment.totalInvested ?? investment.totalinvested) || 0;
        const totalAvailableForRedemption =
          Number(
            investment.totalAvailableForRedemption ??
              investment.totalavailableforredemption,
          ) || 0;

        return {
          totalInvested,
          totalAvailableForRedemption,
          marketShares: share
            ? {
                ...share,
                totalInvested,
                totalAvailableForRedemption,
              }
            : {},
        };
      }),
      message: 'Investimentos do usuário carregados com sucesso',
    };
  }
}
