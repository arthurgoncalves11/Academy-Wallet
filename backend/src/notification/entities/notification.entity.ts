import { User } from '@/src/user/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('tb_notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid', { name: 'nts_pk_id' })
  id: string;

  @Column('varchar', { name: 'nts_st_title', length: 255 })
  title: string;

  @Column('varchar', {
    name: 'nts_st_description',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column('timestamp', { name: 'nts_dt_date' })
  createdAt: Date;

  @Column('boolean', { name: 'nts_bl_seen' })
  seen: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'usr_fk_id' })
  user: User;
}
