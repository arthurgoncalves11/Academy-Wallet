import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { WalletService } from '@/src/wallet/wallet.service';
import { CurrentAccountService } from '@/src/current-account/current-account.service';
import { transactionType } from '@/src/transaction/enum/transactionType';
import {
  ListTransactionData,
  ListTransactionDto,
} from './dto/list-transaction.dto';
import { UserService } from '../user/user.service';
import { EncryptService } from '../common/services/encrypt.service';
import { compareSync as bcryptCompareSync } from 'bcryptjs';
import { REQUEST } from '@nestjs/core';
import { NotificationService } from '../notification/notification.service';

@Injectable({ scope: Scope.REQUEST })
export class TransactionService {
  private storedTransactionsPassword: string;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly walletService: WalletService,
    private readonly currentAccountService: CurrentAccountService,
    private readonly userService: UserService,
    private readonly encryptService: EncryptService,
    private readonly notificationService: NotificationService,
    private dataSource: DataSource,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const userId = this.userService.extractUserIdFromToken();
    try {
      await this.makeTransaction(createTransactionDto);
    } catch (error) {
      await this.notificationService.sendNotification(
        userId,
        'Erro no pagamento',
        'Houve um erro ao realizar o seu pagamento',
      );
      throw error;
    }

    await this.notificationService.sendNotification(
      userId,
      'Pagamento efetuado',
      'Pagamento realizado com sucesso',
    );

    return { message: 'Transação efetuada com sucesso' };
  }

  async makeTransaction(createTransactionDto: CreateTransactionDto) {
    if (createTransactionDto.value <= 0 || !createTransactionDto.value)
      throw new UnauthorizedException({
        message: 'Transacao nao pode ser negativa, nem zero e nem nulo',
      });
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const wallet = await this.walletService.findOne(
      createTransactionDto.walletId,
    );
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      wallet,
    });
    this.storedTransactionsPassword = wallet.transactionsPassword;
    await this.signTransaction(createTransactionDto.transactionsPassword);
    try {
      if (createTransactionDto.type === transactionType.DEBIT) {
        if (wallet.currentAccount.balance < createTransactionDto.value) {
          throw new BadRequestException('Saldo insuficiente');
        }

        wallet.currentAccount.balance -= createTransactionDto.value;
      } else {
        wallet.currentAccount.balance =
          Number(wallet.currentAccount.balance) +
          Number(createTransactionDto.value);
      }

      await this.currentAccountService.update(wallet.currentAccount.id, {
        balance: Number(wallet.currentAccount.balance),
      });

      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  isSufficientBalanceAndCheckTransactionValue(balance: number, value: number) {
    if (value <= 0 || !value)
      throw new UnauthorizedException({
        message: 'Transacao nao pode ser negativa, nem zero e nem nulo',
      });
    if (Number(balance) < Number(value)) {
      throw new BadRequestException('Saldo insuficiente');
    }
  }

  async getTransections(idWallet: string) {
    const transaction = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select([
        'transaction.tcs_dt_date',
        'transaction.tcs_st_description',
        'transaction.tcs_st_name',
        'transaction.tcs_db_value',
        'transaction.tcs_st_type',
      ])
      .where('transaction.wlt_fk_id = :idWallet', { idWallet })
      .orderBy('transaction.tcs_dt_date', 'DESC');

    return transaction;
  }

  async findTransactions(
    idWallet: string,
    limit?: number,
  ): Promise<ListTransactionDto> {
    const transaction = await this.getTransections(idWallet);
    if (limit && limit > 0) {
      transaction.limit(limit);
    }
    return this.mapToTransactionResponseDto(
      await transaction.getRawMany<ListTransactionData>(),
    );
  }

  private mapToTransactionResponseDto(
    transactions: ListTransactionData[],
  ): ListTransactionDto {
    return { data: transactions };
  }

  async findTransactionsInPeriodTime(
    idWallet: string,
    days: number,
  ): Promise<ListTransactionDto> {
    const transaction = await this.getTransections(idWallet);
    if (!Number.isInteger(days)) {
      throw new Error('Não é permitido valores decimais');
    }

    if (days >= 0) {
      transaction.andWhere(
        "transaction.tcs_dt_date >= current_date - (:days || ' days')::INTERVAL",
        { days },
      );
    } else if (days < 0) {
      this.findTransactions(idWallet);
    } else {
      throw new Error('Caracter invalido');
    }
    return this.mapToTransactionResponseDto(
      await transaction.getRawMany<ListTransactionData>(),
    );
  }

  async signTransaction(transactionsPasswordEncrypted: string) {
    const userId = this.userService.extractUserIdFromToken();
    const userFound = await this.userService.findOneByOrFail('id', userId);

    this.storedTransactionsPassword = userFound.wallet.transactionsPassword;

    if (!userFound.cryptKey)
      throw new BadRequestException(
        `Usuário com id ${userId} não tem chave de criptografia salva`,
      );

    const decryptedPassword = this.encryptService.decrypt(
      transactionsPasswordEncrypted,
      userFound.cryptKey,
    );
    this.isTransactionsPasswordCorrect(decryptedPassword);
  }

  isTransactionsPasswordCorrect(decryptedPassword: string) {
    const passwordStringSplited = decryptedPassword.split('');
    console.log(passwordStringSplited);
    const passwordNumber = passwordStringSplited.map(Number);
    console.log(passwordNumber);
    const numbersSplited = this.splitNumbersIntoChunks(passwordNumber, 6);
    console.log(numbersSplited);

    for (let combinationIndex = 0; combinationIndex < 64; combinationIndex++) {
      const candidatePassword = this.generateCandidatePassword(
        numbersSplited,
        combinationIndex,
      );
      console.log('Tentativa de senha ', candidatePassword);
      if (this.checkPasswordAgainstBank(candidatePassword)) return true;
    }

    throw new UnauthorizedException('Senha transacional incorreta');
  }

  private generateCandidatePassword(
    chunks: number[][],
    combinationIndex: number,
  ): string {
    const bits = combinationIndex.toString(2).padStart(6, '0');
    const choices = bits.split('').map((bit) => parseInt(bit, 10));
    return chunks.map((chunk, index) => chunk[choices[index]]).join('');
  }

  checkPasswordAgainstBank(candidatePassword: string) {
    return bcryptCompareSync(
      candidatePassword,
      this.storedTransactionsPassword,
    );
  }

  async getEncryptKey() {
    const { publicKey, privateKey } = this.encryptService.generateKeyPair();

    const userId = this.userService.extractUserIdFromToken();
    const userFound = await this.userService.findFullUserByWithoutWallet(
      'id',
      userId,
    );

    if (!userFound)
      throw new NotFoundException(`Usuário com id ${userId} não encontrado`);

    userFound.cryptKey = privateKey;

    await this.userService.update(userFound.id, userFound);

    return { data: { cryptKey: publicKey } };
  }

  splitNumbersIntoChunks(numbers: number[], chunks: number) {
    return Array.from({ length: chunks }, (v, i) =>
      numbers.slice(i * 2, i * 2 + 2),
    );
  }
}
