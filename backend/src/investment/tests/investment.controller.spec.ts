import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentController } from '../investment.controller';
import { InvestmentService } from '../investment.service';
import { CreateInvestmentDto } from '../dto/create-investment.dto';
import { WithdrawInvestmentDto } from '../dto/withdraw-investment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth/jwt-auth.guard';
import { CanActivate } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InvestmentWalletService } from '../../investment-wallet/investment-wallet.service';

describe('InvestmentController', () => {
  let controller: InvestmentController;
  let service: InvestmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentController],
      providers: [
        {
          provide: InvestmentService,
          useValue: {
            create: jest.fn(),
            withdrawFunds: jest.fn(),
            withdrawFundsAndNofifyUser: jest.fn(),
            getInvestmentSummary: jest.fn(),
            getUserInvestments: jest.fn(),
          },
        },
        {
          provide: InvestmentWalletService,
          useValue: {},
        },

        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    })

      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      } as CanActivate)
      .compile();

    controller = module.get<InvestmentController>(InvestmentController);
    service = module.get<InvestmentService>(InvestmentService);
  });

  describe('create', () => {
    it('deve chamar o método create do service e retornar a resposta correta', async () => {
      const dto: CreateInvestmentDto = {
        walletId: '550e8400-e29b-41d4-a716-446655440000',
        marketShareId: '550e8400-e29b-41d4-a716-446655440001',
        initialValue: 200,
        transactionsPassword: 'password',
      };
      const expectedResponse = { message: 'Investimento efetuado com sucesso' };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);
      expect(result).toEqual(expectedResponse);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('withdrawFunds', () => {
    it('deve chamar o método withdrawFunds do service e retornar a resposta correta', async () => {
      const dto: WithdrawInvestmentDto = {
        walletId: '550e8400-e29b-41d4-a716-446655440002',
        marketShareId: '550e8400-e29b-41d4-a716-446655440003',
        amount: 100,
        transactionsPassword: 'password',
      };
      const expectedResponse = {
        data: { newBalance: 400 },
        message: 'Resgate de investimento efetuado com sucesso',
      };

      jest
        .spyOn(service, 'withdrawFundsAndNofifyUser')
        .mockResolvedValue(expectedResponse);

      const result = await service.withdrawFundsAndNofifyUser(dto);
      expect(result).toEqual(expectedResponse);
      expect(service.withdrawFundsAndNofifyUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('getInvestmentSummary', () => {
    it('deve chamar o método getInvestmentSummary do service e retornar a resposta correta', async () => {
      const walletId = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResponse = {
        data: {
          totalInvested: 500,
          totalAvailableForRedemption: 500,
        },
        message: 'Resumo de investimentos carregado com sucesso',
      };

      jest
        .spyOn(service, 'getInvestmentSummary')
        .mockResolvedValue(expectedResponse);

      const result = await controller.getInvestmentSummary(walletId);
      expect(result).toEqual(expectedResponse);
      expect(service.getInvestmentSummary).toHaveBeenCalledWith(walletId);
    });
  });

  describe('getUserInvestments', () => {
    it('deve chamar o método getUserInvestments do service e retornar a resposta correta', async () => {
      const walletId = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResponse = {
        data: [
          {
            marketShareId: 'some-market-share-id',
            totalInvested: 500,
            totalAvailableForRedemption: 500,
            marketShares: {},
          },
        ],
        message: 'Investimentos do usuário carregados com sucesso',
      };

      jest
        .spyOn(service, 'getUserInvestments')
        .mockResolvedValue(expectedResponse);

      const result = await controller.getUserInvestments(walletId);
      expect(result).toEqual(expectedResponse);
      expect(service.getUserInvestments).toHaveBeenCalledWith(walletId);
    });
  });
});
