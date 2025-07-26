import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTablePaidSlip1739551608377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_paid_slip',
        columns: [
          {
            name: 'ps_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'ps_barcode',
            type: 'varchar',
            length: '48',
            isNullable: false,
            isUnique: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_paid_slip');
  }
}
