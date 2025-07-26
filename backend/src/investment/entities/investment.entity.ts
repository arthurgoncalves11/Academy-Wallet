import { Wallet } from '@/src/wallet/entities/wallet.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { MarketShare } from '@/src/market-share/entities/market-share.entity';

@Entity('tb_investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid', { name: 'ivs_pk_id' })
  id: string;

  @Column('date', { name: 'ivs_dt_acquired_at' })
  acquiredAt: Date;

  @Column('boolean', { name: 'ivs_bl_is_active', default: true })
  isActive: boolean;

  @Column('decimal', { name: 'ivs_db_initial_value', precision: 10, scale: 2 })
  initialValue: number;

  @Column('decimal', { name: 'ivs_db_balance', precision: 13, scale: 2 })
  balance: number;

  @Column('date', { name: 'ivs_dt_available_at', nullable: false })
  availableAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.investments)
  @JoinColumn({ name: 'wlt_fk_id' })
  wallet: Wallet;

  @ManyToMany(
    () => MarketShare,
    (marketShare: MarketShare) => marketShare.investments,
    {
      cascade: true,
      eager: true,
    },
  )
  @JoinTable({
    name: 'tb_investments_market_shares',
    joinColumn: { name: 'ivs_fk_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'mts_fk_id', referencedColumnName: 'id' },
  })
  marketShares: MarketShare[];
}
