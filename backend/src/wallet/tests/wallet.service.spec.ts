import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../wallet.service';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordService } from '../../common/services/password.service';
import { CurrentAccountService } from '../../current-account/current-account.service';
import { InvestmentWalletService } from '../../investment-wallet/investment-wallet.service';
import { NotFoundException } from '@nestjs/common';
import { walletMock, homeWalletDtoMock, userMock } from './mocks/wallet.mock';

describe('WalletService', () => {
  let walletService: WalletService;
  let walletRepository: Repository<Wallet>;
  let passwordService: PasswordService;
  let currentAccountService: CurrentAccountService;
  let investmentWalletService: InvestmentWalletService;

  const mockPasswordService = {
    hashPassword: jest.fn().mockReturnValue('hashedPassword123'),
  };

  const mockCurrentAccountService = {
    create: jest.fn().mockResolvedValue({}),
  };

  const mockInvestmentWalletService = {
    getInvestmentSummary: jest
      .fn()
      .mockResolvedValue({ totalAvailableForRedemption: 2000.0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            create: jest.fn().mockReturnValue(walletMock),
            save: jest.fn().mockResolvedValue(walletMock),
            findOne: jest.fn().mockResolvedValue(walletMock),
            findOneBy: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: CurrentAccountService,
          useValue: mockCurrentAccountService,
        },
        {
          provide: InvestmentWalletService,
          useValue: mockInvestmentWalletService,
        },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
    passwordService = module.get<PasswordService>(PasswordService);
    currentAccountService = module.get<CurrentAccountService>(
      CurrentAccountService,
    );
    investmentWalletService = module.get<InvestmentWalletService>(
      InvestmentWalletService,
    );
  });

  it('should be defined', () => {
    expect(walletService).toBeDefined();
  });

  describe('create', () => {
    it('should create a wallet successfully', async () => {
      const transactionsPassword = '123456';

      await walletService.create(transactionsPassword, userMock);

      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        transactionsPassword,
      );
      expect(walletRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionsPassword: 'hashedPassword123',
          user: userMock,
        }),
      );
      expect(walletRepository.save).toHaveBeenCalled();
      expect(currentAccountService.create).toHaveBeenCalledWith(walletMock);
    });
  });

  describe('createAccountNumber', () => {
    it('should generate a unique account number', async () => {
      const accountNumber = await walletService.createAccountNumber();

      expect(accountNumber).toBeGreaterThanOrEqual(100000000);
      expect(accountNumber).toBeLessThanOrEqual(999999999);
      expect(walletRepository.findOneBy).toHaveBeenCalledWith({
        account: expect.any(Number),
      });
    });

    it('should retry if generated number already exists', async () => {
      jest
        .spyOn(walletRepository, 'findOneBy')
        .mockResolvedValueOnce(walletMock)
        .mockResolvedValueOnce(null);

      const accountNumber = await walletService.createAccountNumber();

      expect(walletRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(accountNumber).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a wallet by id', async () => {
      const result = await walletService.findOne(walletMock.id);

      expect(result).toEqual(walletMock);
      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { id: walletMock.id },
        relations: ['currentAccount', 'user'],
      });
    });

    it('should throw NotFoundException if wallet not found', async () => {
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(walletService.findOne('non-existent-id')).rejects.toThrow(
        new NotFoundException('Carteira não encontrada'),
      );
    });
  });

  describe('listDataHome', () => {
    it('should return home wallet data', async () => {
      const result = await walletService.listDataHome(walletMock.id);

      expect(result).toEqual(homeWalletDtoMock);
      expect(investmentWalletService.getInvestmentSummary).toHaveBeenCalledWith(
        walletMock.user.id,
      );
    });

    it('should throw NotFoundException if wallet not found', async () => {
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        walletService.listDataHome('non-existent-id'),
      ).rejects.toThrow(new NotFoundException('Carteira não encontrada'));
    });
  });
});
