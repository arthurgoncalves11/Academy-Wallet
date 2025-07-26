import { Investment } from '@/src/investment/entities/investment.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RiskTypes } from '../enum/riskTypes';
import { IsEnum } from 'class-validator';

@Entity('tb_market_shares')
export class MarketShare {
  @PrimaryGeneratedColumn('uuid', { name: 'mts_pk_id' })
  id: string;

  @Column('varchar', { name: 'mts_st_name', length: 255 })
  name: string;

  @Column('varchar', { name: 'mts_st_cnpj', length: 14 })
  cnpj: string;

  @Column('decimal', { name: 'mts_db_min_deposit', precision: 7, scale: 2 })
  minDeposit: number;

  @Column('decimal', { name: 'mts_db_year_yield', precision: 5, scale: 2 })
  yearYield: number;

  @Column('varchar', { name: 'mts_st_risk', length: 50 })
  risk: RiskTypes;

  @Column('decimal', { name: 'mts_it_day_yield', precision: 5, scale: 2 })
  dayYield: number;

  @Column('int', { name: 'mts_it_days_to_retrieve' })
  daysToRetrieve: number;

  @Column('varchar', { name: 'mts_st_benchmark', length: 100 })
  benchmark: string;

  @Column('decimal', { name: 'mts_db_market_value', precision: 13, scale: 2 })
  marketValue: number;

  @Column('date', { name: 'mts_dt_created_at' })
  createdAt: Date;

  @Column('varchar', {
    name: 'mts_st_share_keeper',
    length: 100,
    nullable: true,
  })
  shareKeeper: string;

  @Column('varchar', { name: 'mts_st_manager', length: 100 })
  manager: string;

  @Column('decimal', {
    name: 'mts_db_market_value_year_avg',
    precision: 13,
    scale: 2,
  })
  marketValueYearAvg: number;

  @Column('varchar', {
    name: 'mts_st_redemption',
    nullable: true,
    default: 'D+0',
  })
  redemption: string;

  @ManyToMany(
    () => Investment,
    (investments: Investment) => investments.marketShares,
  )
  investments: Investment[];
  dailyRate: any;
  minBalance: any;
  minInvestment: any;
  withdrawalLimit: any;
}
