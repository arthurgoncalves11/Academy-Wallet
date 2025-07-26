import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordService } from '../../common/services/password.service';
import { WalletService } from '../../wallet/wallet.service';
import { userMock, userResponseMock } from './mocks/user.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { createUserMock } from './mocks/create-user.mock';
import { validate } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';
import { REQUEST } from '@nestjs/core';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let passwordService: PasswordService;
  let walletService: WalletService;

  const mockPasswordService = {
    hashPassword: jest.fn().mockReturnValue('hashedPassword'),
  };

  const mockWalletService = {
    create: jest.fn().mockResolvedValue({}),
  };

  const mockRequest = {
    user: { sub: 'mock-user-id' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(createUserMock),
            save: jest.fn().mockResolvedValue(userMock),
            findOne: jest.fn().mockResolvedValue(userResponseMock),
          },
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: WalletService,
          useValue: mockWalletService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    userService = await module.resolve<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    passwordService = module.get<PasswordService>(PasswordService);
    walletService = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findUserBy', () => {
    it('should return user by id', async () => {
      const user = await userService.findOneByOrFail('id', userResponseMock.id);
      expect(user).toEqual(userResponseMock);
    });

    it('should throw NotFoundException if user not found by id', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        userService.findOneByOrFail('id', userMock.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return user by email', async () => {
      const user = await userService.findOneByOrFail(
        'email',
        userResponseMock.email,
      );
      expect(user).toEqual(userResponseMock);
    });

    it('should throw NotFoundException if user not found by email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        userService.findOneByOrFail('email', userMock.email),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const result = await userService.create(createUserMock);

      expect(result).toEqual({
        data: {
          id: userMock.id,
          email: userMock.email,
        },
      });

      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        'SenhaSegura123!',
      );

      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserMock,
        loginPassword: 'hashedPassword',
      });

      expect(userRepository.save).toHaveBeenCalled();
      expect(walletService.create).toHaveBeenCalledWith(
        createUserMock.transactionsPassword,
        createUserMock,
      );
    });

    it('should throw ConflictException for duplicate email', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce({
        code: '23505',
        message:
          'duplicate key value violates unique constraint "usr_uk_email"',
        constraint: 'usr_uk_email',
      });

      await expect(userService.create(createUserMock)).rejects.toThrow(
        new ConflictException('E-mail já cadastrado.'),
      );
    });

    it('should throw ConflictException for duplicate CPF', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce({
        code: '23505',
        message: 'duplicate key value violates unique constraint "usr_uk_cpf"',
        constraint: 'usr_uk_cpf',
      });

      await expect(userService.create(createUserMock)).rejects.toThrow(
        new ConflictException('CPF já cadastrado.'),
      );
    });
  });

  describe('CreateUserDto Validation', () => {
    let dto: CreateUserDto;

    beforeEach(() => {
      dto = new CreateUserDto();
      dto.name = 'João Silva';
      dto.email = 'joao.silva@example.com';
      dto.loginPassword = 'SenhaSegura123!';
      dto.cpf = '529.982.247-25';
      dto.rg = '123456789';
      dto.transactionsPassword = '123456';
    });

    it('should pass validation with valid data', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('Name Validation', () => {
      it('should fail with empty name', async () => {
        dto.name = '';
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('should fail with short name', async () => {
        dto.name = 'Ab';
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isLength');
      });

      it('should fail with special characters', async () => {
        dto.name = 'João3 Silva@';
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('matches');
      });
    });

    describe('Email Validation', () => {
      it('should fail with invalid email format', async () => {
        dto.email = 'emailinvalido';
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('isEmail');
      });
    });

    describe('Password Validation', () => {
      it('should fail with short password', async () => {
        dto.loginPassword = 'abc123';
        const errors = await validate(dto);
        expect(errors[0].constraints).toHaveProperty('minLength');
      });
    });

    describe('CPF Validation', () => {
      const invalidCases = [
        { cpf: '111.111.111-11', reason: 'Sequência inválida' },
        { cpf: '123.456.789-03', reason: 'Dígitos verificadores inválidos' },
        { cpf: '12345', reason: 'Formato inválido' },
        { cpf: '529.982.247-2A', reason: 'Caracteres não numéricos' },
      ];

      invalidCases.forEach(({ cpf, reason }) => {
        it(`should fail for ${reason}`, async () => {
          dto.cpf = cpf;
          const errors = await validate(dto);
          expect(errors[0].constraints).toHaveProperty('IsCPFConstraint');
        });
      });
    });

    describe('RG Validation', () => {
      const invalidCases = [
        { rg: '12345', reason: 'Curto demais' },
        { rg: '123456789012345', reason: 'Longo demais' },
        { rg: 'ABC!2345', reason: 'Caracteres especiais' },
      ];

      invalidCases.forEach(({ rg, reason }) => {
        it(`should fail for ${reason}`, async () => {
          dto.rg = rg;
          const errors = await validate(dto);
          expect(errors[0].constraints).toHaveProperty('matches');
        });
      });
    });

    describe('Transactions Password Validation', () => {
      const invalidCases = [
        { password: 12345, reason: 'Muito curto' },
        { password: 1234567, reason: 'Muito longo' },
        { password: 'abcdef', reason: 'Não numérico' },
        { password: 12345.6, reason: 'Decimal inválido' },
      ];

      invalidCases.forEach(({ password, reason }) => {
        it(`should fail for ${reason}`, async () => {
          dto.transactionsPassword = password as any;
          const errors = await validate(dto);
          expect(errors[0].constraints).toHaveProperty('matches');
        });
      });
    });
  });
});
