import { CurrentAccount } from '@/src/current-account/entities/current-account.entity';
import { Investment } from '@/src/investment/entities/investment.entity';
import { User } from '@/src/user/entities/user.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Transaction } from '@/src/transaction/entities/transaction.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('tb_wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid', { name: 'wlt_pk_id' })
  id: string;

  @Column('int', { name: 'wlt_it_agency' })
  agency: number;

  @Column('int', { name: 'wlt_it_account' })
  account: number;

  @Column('int', { name: 'wlt_it_organization' })
  organization: number;

  @Column('varchar', {
    name: 'wlt_st_transactions_password',
    length: 255,
  })
  transactionsPassword: string;

  @OneToOne(() => CurrentAccount, (currentAccount) => currentAccount.wallet)
  currentAccount: CurrentAccount;

  @OneToMany(() => Investment, (investment) => investment.wallet)
  investments: Investment[];

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'usr_fk_id' })
  user: User;
}
