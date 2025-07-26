import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaidSlipDto } from './dto/create-paid-slip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaidSlip } from '@/src/paid-slips/entities/paid-slip.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '@/src/transaction/dto/create-transaction.dto';
import { transactionType } from '@/src/transaction/enum/transactionType';
import { TransactionService } from '@/src/transaction/transaction.service';
import axios from 'axios';
import { returnSlipDto } from '@/src/paid-slips/dto/return-slip.dto';
import { SlipPendent } from '@/src/paid-slips/entities/slipPendent.entity';
import ehDiaUtil from 'eh-dia-util-slim';
import { WalletService } from '@/src/wallet/wallet.service';
import { Wallet } from '@/src/wallet/entities/wallet.entity';
import { UserService } from '@/src/user/user.service';

@Injectable()
export class PaidSlipsService {
  private readonly LINK_SLIP: string =
    'https://www.veloso.adm.br/checkboleto/php/BoletoWS.php';
  private readonly LINK_BANK: string = 'https://brasilapi.com.br/api/banks/v1/';

  constructor(
    @InjectRepository(PaidSlip)
    private readonly paidSlipRepository: Repository<PaidSlip>,
    @InjectRepository(SlipPendent)
    private readonly slipPendentRepository: Repository<SlipPendent>,
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  async create(createPaidSlipDto: CreatePaidSlipDto) {
    this.isSlipValide(createPaidSlipDto.barcode);
    await this.isPaid(createPaidSlipDto.barcode);
    const wallet: Wallet = await this.walletService.findOne(
      createPaidSlipDto.walletId,
    );
    await this.transactionService.signTransaction(
      createPaidSlipDto.transactionPassword,
    );
    this.transactionService.isSufficientBalanceAndCheckTransactionValue(
      wallet.currentAccount.balance,
      createPaidSlipDto.value,
    );
    if (this.isBusinessDay()) {
      await this.setTransaction(createPaidSlipDto);
      const paidSlip: PaidSlip =
        this.paidSlipRepository.create(createPaidSlipDto);
      await this.paidSlipRepository.save(paidSlip);
      return {
        data: paidSlip,
        message: 'Pagamento concluido com sucesso!',
      };
    }
    const slipPendent: SlipPendent =
      this.slipPendentRepository.create(createPaidSlipDto);
    await this.slipPendentRepository.save(slipPendent);
    return {
      message: 'Pagamento aguardando compensação',
    };
  }

  async setTransaction(slip: CreatePaidSlipDto) {
    const transactioDTO: CreateTransactionDto = {
      description: 'Boleto',
      name: slip.name,
      transactionsPassword: slip.transactionPassword,
      type: transactionType.DEBIT,
      value: slip.value,
      walletId: slip.walletId,
    };
    await this.transactionService.create(transactioDTO);
  }

  isBusinessDay(): boolean {
    const currentDate = new Date();
    const businessDate = this.getNextBusinessDay(new Date(currentDate));
    return currentDate.getDate() == businessDate.getDate();
  }

  async isPaid(barcode: string) {
    const paidSlipFound = await this.paidSlipRepository.findOne({
      where: { barcode },
    });
    const paidSlipPendentFound = await this.slipPendentRepository.findOne({
      where: { barcode },
    });
    if (paidSlipFound || paidSlipPendentFound)
      throw new ConflictException({ message: 'Boleto ja esta pago' });
  }

  async getBank(bankCode: string) {
    try {
      const response = await axios.get(this.LINK_BANK + bankCode);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getCurrentDate(today: Date) {
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  convertDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  isDateExpirated(dateExpirate: Date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    dateExpirate.setHours(0, 0, 0, 0);
    if (currentDate > dateExpirate) {
      throw new ConflictException('Boleto expirado!');
    }
  }

  getNextBusinessDay(date = new Date()): Date {
    if (!ehDiaUtil(date)) {
      date.setDate(date.getDate() + 1);
      return this.getNextBusinessDay(date);
    }
    return date;
  }

  isSlipValide(code: string) {
    if (!/^\d+$/.test(code) || ![44, 47].includes(code.length))
      throw new ConflictException({ message: 'Codigo invalido' });
  }

  async findBankSlip(digitado: string) {
    try {
      this.isSlipValide(digitado);
      const { data } = await axios.post(this.LINK_SLIP, { digitado });
      if (data[0].erro === '999') {
        throw new NotFoundException('Boleto nao encontrado!');
      }
      await this.isPaid(data[0].conteudo_barras);
      const slip = data[0];
      const dateToOperation = this.getNextBusinessDay(new Date());
      const dateExpired = this.convertDate(slip.data_vencimento);
      this.isDateExpirated(dateExpired);
      const bank = await this.getBank(slip.codigo_banco);
      const returnSlip: returnSlipDto = {
        account: slip.codigo_cedente,
        agency: slip.agencia,
        barcode: slip.conteudo_barras,
        cpfOrCnpj: '',
        dateForExpirate: slip.data_vencimento,
        dateToOperation: this.getCurrentDate(dateToOperation),
        dateToPay: this.getCurrentDate(new Date()),
        discount: 0,
        fees: 0,
        institution: '',
        nameBank: bank.fullName,
        nameFantasy: '',
        penalty: 0,
        legalName: '',
        nominalValue: slip.valor,
        valueToPay: slip.valor,
      };
      return { data: returnSlip, message: 'Boleto achado com sucesso' };
    } catch (error) {
      throw error;
    }
  }

  async findSlipsPendent() {
    const userId = this.userService.extractUserIdFromToken();
    const userFound = await this.userService.findOneByOrFail('id', userId);
    return {
      data: await this.slipPendentRepository.find({
        where: {
          walletId: userFound.wallet.id,
        },
      }),
    };
  }
}
