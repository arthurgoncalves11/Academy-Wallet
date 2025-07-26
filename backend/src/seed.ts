import { DataSource } from 'typeorm';
import 'dotenv/config';
import { PasswordService } from '@/src/common/services/password.service';
import { UserService } from './user/user.service';

async function connection() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const connect = await dataSource.initialize();
  const queryRunner = connect.createQueryRunner();
  const passwordService = new PasswordService();

  await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  const users = [
    {
      name: 'John Doe',
      email: 'john.doe@email.com',
      cpf: '67573022093',
      rg: '123456789',
    },
    {
      name: 'Marie Doe',
      email: 'marie.doe@email.com',
      cpf: '41304059006',
      rg: '987654321',
    },
    {
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      cpf: '85732649093',
      rg: '456789123',
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      cpf: '93847561027',
      rg: '234567891',
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      cpf: '12765439087',
      rg: '345678912',
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      cpf: '56789432016',
      rg: '567891234',
    },
  ];

  for (const user of users) {
    await queryRunner.query(
      `
        INSERT INTO public.tb_user
          (usr_pk_id, usr_st_name, usr_st_email, usr_st_login_password, usr_st_cpf, usr_st_rg, usr_bl_first_access)
        VALUES
          (uuid_generate_v4(), $1, $2, $3, $4, $5, $6);
      `,
      [
        user.name,
        user.email,
        passwordService.hashPassword('P@ssword123'),
        user.cpf,
        user.rg,
        false,
      ],
    );
  }

  const wallets = [
    { account: 800000001, user: 'John Doe' },
    { account: 800000002, user: 'Marie Doe' },
    { account: 800000003, user: 'Robert Smith' },
    { account: 800000004, user: 'Alice Johnson' },
    { account: 800000005, user: 'Michael Brown' },
    { account: 800000006, user: 'Sarah Wilson' },
  ];

  for (const wallet of wallets) {
    await queryRunner.query(
      `
        INSERT INTO public.tb_wallet
          (wlt_pk_id, wlt_it_agency, wlt_it_account, wlt_it_organization, wlt_st_transactions_password, usr_fk_id)
        VALUES
          (uuid_generate_v4(), 1, $1, 380, $2, (SELECT usr_pk_id FROM public.tb_user WHERE usr_st_name = $3 LIMIT 1));
      `,
      [wallet.account, passwordService.hashPassword('123456'), wallet.user],
    );
  }

  const currentAccounts = [
    { account: 800000001 },
    { account: 800000002 },
    { account: 800000003 },
    { account: 800000004 },
    { account: 800000005 },
    { account: 800000006 },
  ];

  for (const currentAccount of currentAccounts) {
    await queryRunner.query(
      `
        INSERT INTO public.tb_current_account (cta_pk_id, cta_db_balance, wlt_fk_id)
        VALUES (uuid_generate_v4(), 5000.00, (SELECT wlt_pk_id FROM public.tb_wallet WHERE wlt_it_account = $1 LIMIT 1));
      `,
      [currentAccount.account],
    );
  }

  const existingRecords = await queryRunner.query(
    `SELECT 1 FROM tb_market_shares LIMIT 1`,
  );

  if (existingRecords.length === 0) {
    await queryRunner.query(`
       INSERT INTO tb_market_shares (
    mts_pk_id,
    mts_st_name,
    mts_st_cnpj,
    mts_db_min_deposit,
    mts_db_year_yield,
    mts_st_risk,
    mts_it_day_yield,
    mts_it_days_to_retrieve,
    mts_st_benchmark,
    mts_db_market_value,
    mts_dt_created_at,
    mts_st_manager,
    mts_st_share_keeper,
    mts_db_market_value_year_avg,
    mts_st_redemption
  ) VALUES
    (uuid_generate_v4(), 'ARX Denial FIC FIRF CP', '83167388000147', 100.00, 11.61, 'ALTO', 1.5, 0, 'CDI', 75274870.07, '2025-01-22', 'ARX', 'Aliança do Guardião', 75274870.07, 'D+1'),
    (uuid_generate_v4(), 'Sulamérica Inflatie FI RF LP', '93765839000100', 5.00, -0.80, 'MUITO_ALTO', 2.5, 0, 'CDI', 361281012.56, '2025-01-22', 'Sulamérica', 'Guardiões da Luz', 218277941.32, 'D+0'),
    (uuid_generate_v4(), 'Absolute Alpha Global FIC FIM', '60900535000140', 1.00, 9.24, 'MUITO_BAIXO', 0.0, 0, 'CDI', 148099027.62, '2025-01-22', 'Absolute', 'Vigilantes do Amanhã', 194218970.08, 'D+0'),
    (uuid_generate_v4(), 'Apex Equity Hedge FIM', '97330853000123', 10.00, 5.78, 'MUITO_ALTO', 3.3, 0, 'CDI', 397839359.10, '2025-01-22', 'Apex', 'Sentinelas do Horizonte', 245623567.83, 'D+0'),
    (uuid_generate_v4(), 'Ibiuna Long Blased FIC FIM', '86988726000108', 0.01, -5.08, 'BAIXO', 0.9, 0, 'CDI', 353690214.34, '2025-01-22', 'Ibiuna', 'Protetores do Nexus', 267636496.34, 'D+0'),
    (uuid_generate_v4(), 'ARX Everest FIC Renda Fixa Crédito Privado', '86695496000180', 33.00, 9.80, 'MUITO_ALTO', 3.5, 0, 'CDI', 156700845.08, '2025-01-22', 'ARX', 'Defensores da Chama Eterna', 248147554.13, 'D+0'),
    (uuid_generate_v4(), 'Icatu Vanguarda Credit Plus FIC Renda Fixa Crédito Privado', '76954780000170', 0.00, -0.50, 'MODERADO', 1.4, 0, 'CDI', 397964598.46, '2025-01-22', 'Icatu', 'Zeladores do Vórtice', 270550704.75, 'D+0'),
    (uuid_generate_v4(), 'Angá High Yield FI Renda Fixa Crédito Privado', '98714780000136', 25.00, 1.26, 'ALTO', 2.6, 0, 'CDI', 281784064.50, '2025-01-22', 'Angá', 'Guardas do Infinito', 271828373.59, 'D+0'),
    (uuid_generate_v4(), 'Guepardo Institucional FIC Ações', '09777729000143', 5.00, 3.28, 'MUITO_BAIXO', 3.4, 0, 'CDI', 51193040.85, '2025-01-22', 'Guepardo', 'Escudos da Virtude', 247646337.95, 'D+0'),
    (uuid_generate_v4(), 'Sulamérica Selection FI Ações', '30568721000163', 15.00, -15.08, 'ALTO', 1.9, 0, 'CDI', 197088175.68, '2025-01-22', 'Sulamérica', 'Heraldos do Equilíbrio', 243591020.83, 'D+0'),
    (uuid_generate_v4(), 'Tarpon GT FIC Ações', '04018834000185', 17.50, 16.62, 'MUITO_ALTO', 3.5, 0, 'CDI', 478904576.03, '2025-01-22', 'Tarpon', 'Falcões da Esperança', 260292789.66, 'D+0'),
    (uuid_generate_v4(), 'Dahlia 70 Advisory XP Seguros Previdência FI Multimercado', '13643906000176', 12.25, -2.83, 'MUITO_ALTO', 5.5, 0, 'CDI', 34127846.02, '2025-01-22', 'Dahlia', 'Custódios do Éter', 239403392.77, 'D+0'),
    (uuid_generate_v4(), 'Trígono 70 Previdência FIC Multimercado', '10205437000115', 33.33, 19.21, 'MUITO_BAIXO', 0.0, 0, 'CDI', 376352256.25, '2025-01-22', 'Trígono', 'Legião do Obelisco', 245738681.33, 'D+0'),
    (uuid_generate_v4(), 'Bogari Value Icatu Prev FI Multimercado', '82045000000172', 11.11, 2.43, 'ALTO', 1.6, 0, 'CDI', 302261526.59, '2025-01-22', 'Bogari', 'Patrulha das Estrelas', 251423150.83, 'D+0'),
    (uuid_generate_v4(), 'Itaú Prev Truxt Valor Ações FIC Ações', '37390872000113', 99.99, -2.11, 'MUITO_ALTO', 2.2, 0, 'CDI', 108453516.69, '2025-01-22', 'Itaú', 'Anciões do Véu', 253128995.62, 'D+0');

      `);
  }
  let index = 0;
  let indexInvest = 0;
  const investments = [
    {
      account: 800000001,
      acquiredAt: '2025-02-14',
      initialValue: 1000.0,
      balance: 1050.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-15',
    },
    {
      account: 800000002,
      acquiredAt: '2025-02-14',
      initialValue: 500.0,
      balance: 550.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-14',
    },
    {
      account: 800000003,
      acquiredAt: '2025-02-14',
      initialValue: 750.0,
      balance: 800.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-14',
    },
    {
      account: 800000004,
      acquiredAt: '2025-02-14',
      initialValue: 2000.0,
      balance: 2100.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-14',
    },
    {
      account: 800000005,
      acquiredAt: '2025-02-14',
      initialValue: 300.0,
      balance: 320.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-14',
    },
    {
      account: 800000006,
      acquiredAt: '2025-02-14',
      initialValue: 1500.0,
      balance: 1550.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-14',
    },

    {
      account: 800000001,
      acquiredAt: '2025-02-09',
      initialValue: 1100.0,
      balance: 1155.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-09',
    },
    {
      account: 800000002,
      acquiredAt: '2025-02-09',
      initialValue: 600.0,
      balance: 660.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-09',
    },
    {
      account: 800000003,
      acquiredAt: '2025-02-09',
      initialValue: 800.0,
      balance: 880.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-09',
    },
    {
      account: 800000004,
      acquiredAt: '2025-02-09',
      initialValue: 2100.0,
      balance: 2205.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-09',
    },
    {
      account: 800000005,
      acquiredAt: '2025-02-09',
      initialValue: 350.0,
      balance: 375.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-09',
    },
    {
      account: 800000006,
      acquiredAt: '2025-02-09',
      initialValue: 1600.0,
      balance: 1650.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-09',
    },

    {
      account: 800000001,
      acquiredAt: '2025-02-01',
      initialValue: 1200.0,
      balance: 1260.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-01',
    },
    {
      account: 800000002,
      acquiredAt: '2025-02-01',
      initialValue: 700.0,
      balance: 770.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-01',
    },
    {
      account: 800000003,
      acquiredAt: '2025-02-01',
      initialValue: 850.0,
      balance: 920.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-01',
    },
    {
      account: 800000004,
      acquiredAt: '2025-02-01',
      initialValue: 2200.0,
      balance: 2310.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-02',
    },
    {
      account: 800000005,
      acquiredAt: '2025-02-01',
      initialValue: 400.0,
      balance: 440.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-01',
    },
    {
      account: 800000006,
      acquiredAt: '2025-02-01',
      initialValue: 1700.0,
      balance: 1760.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-01',
    },

    {
      account: 800000001,
      acquiredAt: '2025-01-17',
      initialValue: 1300.0,
      balance: 1365.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-01-18',
    },
    {
      account: 800000002,
      acquiredAt: '2025-01-17',
      initialValue: 800.0,
      balance: 880.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-01-17',
    },
    {
      account: 800000003,
      acquiredAt: '2025-01-17',
      initialValue: 900.0,
      balance: 990.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-01-17',
    },
    {
      account: 800000004,
      acquiredAt: '2025-01-17',
      initialValue: 2300.0,
      balance: 2420.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-01-17',
    },
    {
      account: 800000005,
      acquiredAt: '2025-01-17',
      initialValue: 450.0,
      balance: 495.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-01-17',
    },
    {
      account: 800000006,
      acquiredAt: '2025-01-17',
      initialValue: 1800.0,
      balance: 1870.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-01-17',
    },

    {
      account: 800000001,
      acquiredAt: '2025-02-17',
      initialValue: 1300.0,
      balance: 1365.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-17',
    },
    {
      account: 800000002,
      acquiredAt: '2025-02-17',
      initialValue: 800.0,
      balance: 880.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-17',
    },
    {
      account: 800000003,
      acquiredAt: '2025-02-17',
      initialValue: 900.0,
      balance: 990.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-17',
    },
    {
      account: 800000004,
      acquiredAt: '2025-02-17',
      initialValue: 2300.0,
      balance: 2420.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-17',
    },
    {
      account: 800000005,
      acquiredAt: '2025-02-17',
      initialValue: 450.0,
      balance: 495.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-17',
    },
    {
      account: 800000006,
      acquiredAt: '2025-02-17',
      initialValue: 1800.0,
      balance: 1870.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-17',
    },

    {
      account: 800000001,
      acquiredAt: '2025-02-03',
      initialValue: 1300.0,
      balance: 1365.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-03',
    },
    {
      account: 800000002,
      acquiredAt: '2025-02-03',
      initialValue: 800.0,
      balance: 880.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-03',
    },
    {
      account: 800000003,
      acquiredAt: '2025-02-03',
      initialValue: 900.0,
      balance: 990.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-03',
    },
    {
      account: 800000004,
      acquiredAt: '2025-02-03',
      initialValue: 2300.0,
      balance: 2420.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-03',
    },
    {
      account: 800000005,
      acquiredAt: '2025-02-03',
      initialValue: 450.0,
      balance: 495.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-03',
    },
    {
      account: 800000006,
      acquiredAt: '2025-02-03',
      initialValue: 1800.0,
      balance: 1870.0,
      name: 'Investimento',
      description: 'Investimento em ações',
      availableAt: '2025-02-03',
    },
  ];

  for (const investment of investments) {
    await queryRunner.query(
      `
      INSERT INTO tb_investments (
        ivs_pk_id,
        ivs_dt_acquired_at,
        ivs_bl_is_active,
        ivs_db_initial_value,
        ivs_db_balance,
        wlt_fk_id,
        ivs_dt_available_at
      ) VALUES (
        uuid_generate_v4(),
        $1,
        true,
        $2,
        $3,
        (SELECT wlt_pk_id FROM public.tb_wallet WHERE wlt_it_account = $4 LIMIT 1),
        $5
      );
      `,
      [
        investment.acquiredAt,
        investment.initialValue,
        investment.balance,
        investment.account,
        investment.availableAt,
      ],
    );
    await queryRunner.query(
      `INSERT INTO tb_investments_market_shares (
        ivs_fk_id,
        mts_fk_id
      ) VALUES (
        (SELECT ivs_pk_id FROM tb_investments WHERE wlt_fk_id = (SELECT wlt_pk_id FROM tb_wallet WHERE wlt_it_account = $1) ORDER BY ivs_dt_acquired_at LIMIT 1 OFFSET $3),
        (SELECT mts_pk_id FROM tb_market_shares LIMIT 1 OFFSET $2)
      );`,

      [investment.account, index, indexInvest],
    );
    index++;
    if (index >= 15) {
      index = 0;
    }
    if (indexInvest >= 6) {
      indexInvest = 0;
    }
    console.log(index);

    await queryRunner.query(
      `INSERT INTO tb_transactions (
        tcs_pk_id,
        tcs_st_type,
        tcs_db_value,
        tcs_dt_date,
        tcs_st_description,
        tcs_st_name,
        wlt_fk_id
      ) VALUES (
        uuid_generate_v4(),
        'DEBIT',
        $1,
        $2,
        $3,
        $4,
        (SELECT wlt_pk_id FROM public.tb_wallet WHERE wlt_it_account = $5 LIMIT 1)
      );`,
      [
        investment.balance,
        investment.acquiredAt,
        investment.description,
        investment.name,
        investment.account,
      ],
    );

    await queryRunner.query(
      `INSERT INTO tb_notifications (
        nts_pk_id,
        nts_st_title,
        nts_st_description,
        nts_dt_date,
        nts_bl_seen,
        usr_fk_id
      ) VALUES (
        uuid_generate_v4(),
        $1,
        $2,
        $3,
        FALSE,
        (SELECT usr_pk_id FROM public.tb_user 
          WHERE usr_pk_id = (SELECT usr_fk_id FROM public.tb_wallet WHERE wlt_it_account = $4 LIMIT 1) 
          LIMIT 1
        )
      );`,
      [
        investment.name,
        investment.description,
        `${investment.acquiredAt} 10:00:00`,
        investment.account,
      ],
    );
  }

  const transactions = [
    {
      account: 800000001,
      value: 1050.0,
      description: 'Rafaela de Oliveira',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-14',
      type: 'CREDIT',
    },
    {
      account: 800000002,
      value: 550.0,
      description: 'Bruna Camargo',
      name: 'Boleto pago',
      acquiredAt: '2025-02-14',
      type: 'DEBIT',
    },
    {
      account: 800000003,
      value: 800.0,
      description: 'Quanta coisa ltda',
      name: 'Boleto pago',
      acquiredAt: '2025-02-14',
      type: 'DEBIT',
    },
    {
      account: 800000004,
      value: 2100.0,
      description: 'Marcelo Pinehiro',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-14',
      type: 'CREDIT',
    },
    {
      account: 800000005,
      value: 320.0,
      description: 'Marcos Teodoro',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-14',
      type: 'CREDIT',
    },
    {
      account: 800000006,
      value: 1550.0,
      description: 'Thomas Turbo',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-14',
      type: 'CREDIT',
    },

    {
      account: 800000001,
      value: 1200.0,
      description: 'Juliana Silva',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-12',
      type: 'CREDIT',
    },
    {
      account: 800000001,
      value: 500.0,
      description: 'Ana Costa',
      name: 'Boleto pago',
      acquiredAt: '2025-02-10',
      type: 'DEBIT',
    },

    {
      account: 800000002,
      value: 600.0,
      description: 'Carlos Santos',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-11',
      type: 'CREDIT',
    },
    {
      account: 800000002,
      value: 200.0,
      description: 'Lucas Oliveira',
      name: 'Boleto pago',
      acquiredAt: '2025-02-13',
      type: 'DEBIT',
    },

    {
      account: 800000003,
      value: 950.0,
      description: 'Empresa X',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-11',
      type: 'CREDIT',
    },
    {
      account: 800000003,
      value: 150.0,
      description: 'Cliente Y',
      name: 'Boleto pago',
      acquiredAt: '2025-02-13',
      type: 'DEBIT',
    },

    {
      account: 800000004,
      value: 2200.0,
      description: 'Paula Araújo',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-12',
      type: 'CREDIT',
    },
    {
      account: 800000004,
      value: 300.0,
      description: 'Roberta Lima',
      name: 'Boleto pago',
      acquiredAt: '2025-02-13',
      type: 'DEBIT',
    },

    {
      account: 800000005,
      value: 400.0,
      description: 'Vera Martins',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-11',
      type: 'CREDIT',
    },
    {
      account: 800000005,
      value: 100.0,
      description: 'João Pedro',
      name: 'Boleto pago',
      acquiredAt: '2025-02-13',
      type: 'DEBIT',
    },

    {
      account: 800000006,
      value: 1700.0,
      description: 'Fernanda Alves',
      name: 'Depósito em conta',
      acquiredAt: '2025-02-11',
      type: 'CREDIT',
    },
    {
      account: 800000006,
      value: 200.0,
      description: 'José Oliveira',
      name: 'Boleto pago',
      acquiredAt: '2025-02-12',
      type: 'DEBIT',
    },
  ];

  for (const transaction of transactions) {
    await queryRunner.query(
      `INSERT INTO tb_transactions (
        tcs_pk_id,
        tcs_st_type,
        tcs_db_value,
        tcs_dt_date,
        tcs_st_description,
        tcs_st_name,
        wlt_fk_id
      ) VALUES (
        uuid_generate_v4(),
        $6, -- Tipo de transação, pode ser 'CREDIT' ou 'DEBIT' conforme necessário
        $1,
        $2,
        $3,
        $4,
        (SELECT wlt_pk_id FROM public.tb_wallet WHERE wlt_it_account = $5 LIMIT 1)
      );`,
      [
        transaction.value,
        transaction.acquiredAt,
        transaction.description,
        transaction.name,
        transaction.account,
        transaction.type,
      ],
    );

    await queryRunner.query(
      `INSERT INTO tb_notifications (
        nts_pk_id,
        nts_st_title,
        nts_st_description,
        nts_dt_date,
        nts_bl_seen,
        usr_fk_id
      ) VALUES (
        uuid_generate_v4(),
        $1,
        $2,
        $3,
        FALSE,
        (SELECT usr_pk_id FROM public.tb_user 
          WHERE usr_pk_id = (SELECT usr_fk_id FROM public.tb_wallet WHERE wlt_it_account = $4 LIMIT 1) 
          LIMIT 1
        )
      );`,
      [
        transaction.name,
        'Sem descrição',
        `${transaction.acquiredAt} 10:00:00`,
        transaction.account,
      ],
    );
  }
}

connection();
