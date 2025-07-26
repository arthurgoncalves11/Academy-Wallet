import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_paid_slip')
export class PaidSlip {
  @PrimaryGeneratedColumn('uuid', { name: 'ps_pk_id' })
  id: string;
  @Column('varchar', { name: 'ps_barcode', length: 48, unique: true })
  barcode: string;
}
