import { Test, TestingModule } from '@nestjs/testing';
import { MarketShareController } from '../market-share.controller';
import { MarketShareService } from '../market-share.service';
import { RiskTypes } from '../enum/riskTypes';

describe('MarketShareController', () => {
  let controller: MarketShareController;
  let service: MarketShareService;

  const mockMarketShareService = {
    searchMarketShares: jest.fn(),
    findAll: jest.fn(),
    findByRisk: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketShareController],
      providers: [
        {
          provide: MarketShareService,
          useValue: mockMarketShareService,
        },
      ],
    }).compile();

    controller = module.get<MarketShareController>(MarketShareController);
    service = module.get<MarketShareService>(MarketShareService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMarketShares', () => {
    it('deve retornar os market shares com base na consulta', async () => {
      const query = 'Fundo';
      const resultData = [{ id: '1', name: 'Fundo A' }];
      mockMarketShareService.searchMarketShares.mockResolvedValue(resultData);

      const result = await controller.searchMarketShares(query);
      expect(service.searchMarketShares).toHaveBeenCalledWith(query);
      expect(result).toEqual(resultData);
    });
  });

  describe('findAll', () => {
    it('deve retornar os market shares paginados', async () => {
      const page = 2;
      const size = 5;
      const resultData = {
        data: [{ id: '1' }],
        total: 10,
        page,
        size,
        totalPages: 2,
      };
      mockMarketShareService.findAll.mockResolvedValue(resultData);

      const result = await controller.findAll(page, size);
      expect(service.findAll).toHaveBeenCalledWith(page, size);
      expect(result).toEqual(resultData);
    });
  });

  describe('findByRisk', () => {
    it('deve retornar os market shares filtrados pelo risco', async () => {
      const risk = RiskTypes.ALTO;
      const resultData = [{ id: '1', risk }];
      mockMarketShareService.findByRisk.mockResolvedValue(resultData);

      const result = await controller.findByRisk(risk);
      expect(service.findByRisk).toHaveBeenCalledWith(risk);
      expect(result).toEqual(resultData);
    });
  });

  describe('findOne', () => {
    it('deve retornar o market share quando um ID válido é fornecido', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const marketShare = { id, name: 'Fundo A' };
      mockMarketShareService.findOne.mockResolvedValue(marketShare);

      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(marketShare);
    });
  });
});
