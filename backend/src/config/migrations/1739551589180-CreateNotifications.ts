import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableNotifications1739551589180
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_notifications',
        columns: [
          {
            name: 'nts_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nts_st_title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'nts_st_description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'nts_dt_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'nts_bl_seen',
            type: 'boolean',
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
      'tb_notifications',
      new TableForeignKey({
        columnNames: ['usr_fk_id'],
        referencedColumnNames: ['usr_pk_id'],
        referencedTableName: 'tb_user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_notifications');
  }
}
