import { CurrentAccount } from '@/src/current-account/entities/current-account.entity';
import { Investment } from '@/src/investment/entities/investment.entity';
import { Transaction } from '@/src/transaction/entities/transaction.entity';
import { User } from '@/src/user/entities/user.entity';

export class CreateWalletDto {
  transactionsPassword: string;
  account: number;
  agency: number;
  organization: number;
  user: User;
  transactions?: Transaction[];
  investments?: Investment[];
  currentAccount?: CurrentAccount;

  constructor(transactionsPassword: string, accountNumber: number, user: User) {
    this.transactionsPassword = transactionsPassword;
    this.account = accountNumber;
    this.user = user;
    this.agency = 1;
    this.organization = 380;
  }
}
