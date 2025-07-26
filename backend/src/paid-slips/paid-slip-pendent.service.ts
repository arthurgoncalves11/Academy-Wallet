import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletService } from '@/src/wallet/wallet.service';
import { CurrentAccountService } from '@/src/current-account/current-account.service';
import { CreateTransactionDto } from '@/src/transaction/dto/create-transaction.dto';
import { Transaction } from '@/src/transaction/entities/transaction.entity';
import { transactionType } from '@/src/transaction/enum/transactionType';

export class PaidSlipPendentService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly walletService: WalletService,
    private readonly currentAccountService: CurrentAccountService,
    private dataSource: DataSource,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    if (createTransactionDto.value <= 0 || !createTransactionDto.value) {
      throw new UnauthorizedException({
        message: 'Transação não pode ser negativa, zero ou nula.',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await this.walletService.findOne(
        createTransactionDto.walletId,
      );

      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        wallet,
      });

      if (createTransactionDto.type === transactionType.DEBIT) {
        if (
          Number(wallet.currentAccount.balance) <
          Number(createTransactionDto.value)
        ) {
          throw new BadRequestException('Saldo insuficiente.');
        }
        wallet.currentAccount.balance -= createTransactionDto.value;
      } else {
        wallet.currentAccount.balance += createTransactionDto.value;
      }

      await this.currentAccountService.update(wallet.currentAccount.id, {
        balance: Number(wallet.currentAccount.balance),
      });

      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();

      return { message: 'Transação realizada com sucesso.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
