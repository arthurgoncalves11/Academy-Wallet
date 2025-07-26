import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableTransaction1739551491636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_transactions',
        columns: [
          {
            name: 'tcs_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tcs_st_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'tcs_db_value',
            type: 'decimal',
            precision: 13,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'tcs_dt_date',
            type: 'date',
            isNullable: false,
            default: 'CURRENT_DATE',
          },
          {
            name: 'tcs_st_description',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tcs_st_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'wlt_fk_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tb_transactions',
      new TableForeignKey({
        columnNames: ['wlt_fk_id'],
        referencedColumnNames: ['wlt_pk_id'],
        referencedTableName: 'tb_wallet',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_transactions');
  }
}
