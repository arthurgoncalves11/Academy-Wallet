import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableCurrentAccount1739551190528
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_current_account',
        columns: [
          {
            name: 'cta_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'cta_db_balance',
            type: 'decimal',
            precision: 13,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'wlt_fk_id',
            type: 'uuid',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'tb_current_account',
      new TableForeignKey({
        columnNames: ['wlt_fk_id'],
        referencedColumnNames: ['wlt_pk_id'],
        referencedTableName: 'tb_wallet',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_current_account');
  }
}
