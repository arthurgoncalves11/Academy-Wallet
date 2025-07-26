import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateTableUser1739550894794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tb_user',
        columns: [
          {
            name: 'usr_pk_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'usr_st_name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'usr_st_email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'usr_st_login_password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'usr_st_cpf',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'usr_st_rg',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'usr_bl_first_access',
            type: 'boolean',
            default: true,
          },
          {
            name: 'usr_st_recover_token',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'usr_dt_recover_token_timestamp',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'usr_st_crypt_token',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'usr_st_device_token',
            type: 'varchar',
            length: '142',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Criando restrições de unicidade
    await queryRunner.createUniqueConstraints('tb_user', [
      new TableUnique({
        name: 'usr_uk_email',
        columnNames: ['usr_st_email'],
      }),
      new TableUnique({
        name: 'usr_uk_cpf',
        columnNames: ['usr_st_cpf'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_user');
  }
}
