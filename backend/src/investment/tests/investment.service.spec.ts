import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentService } from '../investment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Investment } from '../entities/investment.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { MarketShare } from '../../market-share/entities/market-share.entity';
import { TransactionService } from '../../transaction/transaction.service';
import { NotificationService } from '../../notification/notification.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateInvestmentDto } from '../dto/create-investment.dto';
import { WithdrawInvestmentDto } from '../dto/withdraw-investment.dto';
import { Repository } from 'typeorm';
import { transactionType } from '../../transaction/enum/transactionType';
import { UserService } from '../../user/user.service';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let investmentRepository: Repository<Investment>;
  let walletRepository: Repository<Wallet>;
  let marketShareRepository: Repository<MarketShare>;
  let transactionService: TransactionService;
  let notificationService: NotificationService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentService,
        {
          provide: getRepositoryToken(Investment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getRawOne: jest.fn(),
              getRawMany: jest.fn(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MarketShare),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            makeTransaction: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            extractUserIdFromToken: jest.fn().mockReturnValue('user-id'),
          },
        },
      ],
    }).compile();

    service = module.get<InvestmentService>(InvestmentService);
    investmentRepository = module.get(getRepositoryToken(Investment));
    walletRepository = module.get(getRepositoryToken(Wallet));
    marketShareRepository = module.get(getRepositoryToken(MarketShare));
    transactionService = module.get(TransactionService);
    notificationService = module.get(NotificationService);
    userService = module.get(UserService);
  });

  describe('create', () => {
    it('deve lançar erro se IDs forem inválidos', async () => {
      await expect(
        service.create({
          walletId: 'invalid-id',
          marketShareId: 'invalid-id',
          initialValue: 100,
          transactionsPassword: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('withdrawFundsAndNofifyUser', () => {
    it('deve enviar notificação de erro caso o resgate falhe', async () => {
      jest
        .spyOn(service, 'withdrawFunds')
        .mockRejectedValue(new Error('Erro ao resgatar'));
      await expect(
        service.withdrawFundsAndNofifyUser({
          walletId: 'valid-wallet-id',
          marketShareId: 'valid-marketshare-id',
          amount: 100,
          transactionsPassword: 'valid-password',
        }),
      ).rejects.toThrow('Erro ao resgatar');

      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        'user-id',
        'Erro no resgate de investimento',
        'Houve um erro ao realizar o resgate de seu investimento',
      );
    });
  });

  describe('makeInvestment', () => {
    it('deve lançar erro se IDs forem inválidos', async () => {
      await expect(
        service.makeInvestment({
          walletId: 'invalid-id',
          marketShareId: 'invalid-id',
          initialValue: 100,
          transactionsPassword: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro se a carteira não existir', async () => {
      jest.spyOn(walletRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.makeInvestment({
          walletId: 'valid-wallet-id',
          marketShareId: 'valid-marketshare-id',
          initialValue: 100,
          transactionsPassword: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
