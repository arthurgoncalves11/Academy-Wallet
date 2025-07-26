import { Wallet } from '@/src/wallet/entities/wallet.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Notification } from '@/src/notification/entities/notification.entity';

@Entity('tb_user')
@Unique('usr_uk_email', ['email'])
@Unique('usr_uk_cpf', ['cpf'])
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'usr_pk_id' })
  id: string;

  @Column('varchar', { name: 'usr_st_name', length: 150 })
  name: string;

  @Column('varchar', { name: 'usr_st_email', length: 255 })
  email: string;

  @Column('varchar', { name: 'usr_st_login_password', length: 255 })
  loginPassword: string;

  @Column('varchar', { name: 'usr_st_cpf', length: 11 })
  cpf: string;

  @Column('varchar', { name: 'usr_st_rg', length: 10 })
  rg: string;

  @Column('boolean', { name: 'usr_bl_first_access', default: true })
  firstAccess: boolean;

  @Column('varchar', {
    name: 'usr_st_recover_token',
    length: 100,
    nullable: true,
  })
  recoverToken: string;

  @Column('timestamptz', {
    name: 'usr_dt_recover_token_timestamp',
    nullable: true,
  })
  recoverTokenTimestamp: Date;

  @Column('text', {
    name: 'usr_st_crypt_token',
    nullable: true,
  })
  cryptKey: string | null;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Column('varchar', {
    name: 'usr_st_device_token',
    length: 142,
    nullable: true,
  })
  deviceToken: string | null;
}
