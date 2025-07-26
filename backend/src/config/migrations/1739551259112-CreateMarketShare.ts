import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableMarketShare1739551259112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_market_shares',
        columns: [
          {
            name: 'mts_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'mts_st_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'mts_st_cnpj',
            type: 'varchar',
            length: '14',
          },
          {
            name: 'mts_db_min_deposit',
            type: 'decimal',
            precision: 7,
            scale: 2,
          },
          {
            name: 'mts_db_year_yield',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'mts_st_risk',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'mts_it_day_yield',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'mts_it_days_to_retrieve',
            type: 'int',
          },
          {
            name: 'mts_st_benchmark',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'mts_db_market_value',
            type: 'decimal',
            precision: 13,
            scale: 2,
          },
          {
            name: 'mts_dt_created_at',
            type: 'date',
          },
          {
            name: 'mts_st_share_keeper',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'mts_st_manager',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'mts_db_market_value_year_avg',
            type: 'decimal',
            precision: 13,
            scale: 2,
          },
          {
            name: 'mts_st_redemption',
            type: 'varchar',
            isNullable: true,
            default: "'D+0'",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_market_shares');
  }
}
