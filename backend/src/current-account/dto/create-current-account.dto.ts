import { Wallet } from '@/src/wallet/entities/wallet.entity';

export class CreateCurrentAccountDto {
  wallet: Wallet;
  balance: number;

  constructor(wallet: Wallet, balance: number) {
    this.wallet = wallet;
    this.balance = balance;
  }
}
