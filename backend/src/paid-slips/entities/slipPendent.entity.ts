import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slip_pendent')
export class SlipPendent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  barcode: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  // @Column({ type: 'varchar', length: 255, nullable: false })
  // transactionPassword: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  @Column({ type: 'uuid', nullable: false })
  walletId: string;
}
