import { Wallet } from '@/src/wallet/entities/wallet.entity';
import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('tb_current_account')
export class CurrentAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'cta_pk_id' })
  id: string;

  @Column('decimal', { name: 'cta_db_balance', precision: 13, scale: 2 })
  balance: number;

  @OneToOne(() => Wallet, (wallet) => wallet.currentAccount)
  @JoinColumn({ name: 'wlt_fk_id' })
  wallet: Wallet;
}
