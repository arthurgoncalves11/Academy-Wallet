import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/src/user/entities/user.entity';
import { PasswordService } from '@/src/common/services/password.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { CurrentAccountService } from '../current-account/current-account.service';
import logger from '../../logger';
import { HomeWalletDto } from './dto/home-wallet.dto';
import { InvestmentWalletService } from '../investment-wallet/investment-wallet.service';
import { WalletResponseDto } from './dto/response-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly passwordService: PasswordService,
    private readonly currentAccountService: CurrentAccountService,
    private readonly investmentWalletService: InvestmentWalletService,
  ) {}

  async create(transactionsPassword: string, newUserEntity: User) {
    logger.info('Hasheando senha, gerando numero de conta');
    const createWalletDto = new CreateWalletDto(
      this.passwordService.hashPassword(transactionsPassword),
      await this.createAccountNumber(),
      newUserEntity,
    );

    logger.info('Criando carteira');
    const newWallet = this.walletRepository.create(createWalletDto);

    logger.info('Salvando carteira');
    await this.walletRepository.save(newWallet);

    await this.currentAccountService.create(newWallet);
  }

  async createAccountNumber(): Promise<number> {
    let accountNumber: number;
    let exists: Wallet | null;

    do {
      accountNumber = this.generateRandomNumber();
      exists = await this.walletRepository.findOneBy({
        account: accountNumber,
      });
    } while (exists);

    return accountNumber;
  }

  generateRandomNumber(): number {
    return Math.floor(100000000 + Math.random() * 900000000);
  }

  async findOne(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: ['currentAccount', 'user'],
    });
    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada');
    }
    return wallet;
  }

  async listDataHome(id: string): Promise<HomeWalletDto> {
    const wallet = await this.findOne(id);

    const totalInvestment = (
      await this.investmentWalletService.getInvestmentSummary(wallet.user.id)
    ).totalAvailableForRedemption;

    const dataHome: HomeWalletDto = {
      data: {
        account: wallet.account,
        agency: wallet.agency,
        organization: wallet.organization,
        name: wallet.user.name,
        email: wallet.user.email,
        balanceCurrentAccount: Number(wallet.currentAccount.balance),
        balanceInvestments: totalInvestment,
      },
    };
    return dataHome;
  }
}
