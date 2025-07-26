import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableWallet1739551123481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_wallet',
        columns: [
          {
            name: 'wlt_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'wlt_it_agency',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wlt_it_account',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wlt_it_organization',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wlt_st_transactions_password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'usr_fk_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tb_wallet',
      new TableForeignKey({
        columnNames: ['usr_fk_id'],
        referencedColumnNames: ['usr_pk_id'],
        referencedTableName: 'tb_user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_wallet');
  }
}
