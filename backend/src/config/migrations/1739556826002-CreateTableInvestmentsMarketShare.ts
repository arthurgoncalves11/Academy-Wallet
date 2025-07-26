import { async } from 'rxjs';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableInvestmentsMarketShare1739556826002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_investments_market_shares',
        columns: [
          {
            name: 'ivs_fk_id',
            type: 'uuid',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'mts_fk_id',
            type: 'uuid',
            isNullable: false,
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('tb_investments_market_shares', [
      new TableForeignKey({
        name: 'FK_InvestmentMarketShares_Investment',
        columnNames: ['ivs_fk_id'],
        referencedColumnNames: ['ivs_pk_id'],
        referencedTableName: 'tb_investments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_InvestmentMarketShares_MarketShare',
        columnNames: ['mts_fk_id'],
        referencedColumnNames: ['mts_pk_id'],
        referencedTableName: 'tb_market_shares',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'tb_investments_market_shares',
      'FK_InvestmentMarketShares_MarketShare',
    );
    await queryRunner.dropForeignKey(
      'tb_investments_market_shares',
      'FK_InvestmentMarketShares_Investment',
    );
    await queryRunner.dropTable('tb_investments_market_shares');
  }
}
