import { Wallet } from '@/src/wallet/entities/wallet.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { transactionType } from '@/src/transaction/enum/transactionType';

@Entity('tb_transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'tcs_pk_id' })
  id: string;

  @Column('varchar', { name: 'tcs_st_type', length: 30 })
  type: transactionType;

  @Column('decimal', { name: 'tcs_db_value', precision: 13, scale: 2 })
  value: number;

  @CreateDateColumn({ type: 'date', name: 'tcs_dt_date' })
  date: Date;

  @Column('varchar', { name: 'tcs_st_description', length: 255 })
  description: string;

  @Column('varchar', { name: 'tcs_st_name', length: 255 })
  name: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wlt_fk_id' })
  wallet: Wallet;
}
