import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableInvestment1739551351173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_investments',
        columns: [
          {
            name: 'ivs_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'ivs_dt_acquired_at',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'ivs_bl_is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'ivs_db_initial_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'ivs_db_balance',
            type: 'decimal',
            precision: 13,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'ivs_dt_available_at',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'wlt_fk_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'tb_investments',
      new TableForeignKey({
        name: 'FK_Investment_Wallet',
        columnNames: ['wlt_fk_id'],
        referencedColumnNames: ['wlt_pk_id'],
        referencedTableName: 'tb_wallet',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tb_investments', 'FK_Investment_Wallet');
    await queryRunner.dropTable('tb_investments');
  }
}
