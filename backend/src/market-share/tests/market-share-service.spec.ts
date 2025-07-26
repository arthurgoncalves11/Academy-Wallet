import { Test, TestingModule } from '@nestjs/testing';
import { MarketShareService } from '../market-share.service';
import { MarketShare } from '../entities/market-share.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('MarketShareService', () => {
  let service: MarketShareService;

  const mockMarketShareRepository = {
    createQueryBuilder: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketShareService,
        {
          provide: getRepositoryToken(MarketShare),
          useValue: mockMarketShareRepository,
        },
      ],
    }).compile();

    service = module.get<MarketShareService>(MarketShareService);

    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMarketShares', () => {
    it('deve retornar os market shares com base na consulta', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: '1', name: 'Fundo A' }]),
      };

      mockMarketShareRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.searchMarketShares('Fundo');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'marketShare.name ILIKE :query',
        { query: '%Fundo%' },
      );
      expect(result).toEqual({
        data: [{ id: '1', name: 'Fundo A' }],
        message: 'Market shares encontrados com sucesso',
      });
    });

    it('deve lançar erro se ocorrer problema na query', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('error')),
      };

      mockMarketShareRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      await expect(service.searchMarketShares('Fundo')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findByRisk', () => {
    it('deve retornar os market shares para um risco válido', async () => {
      const risk = 'ALTO';
      const mockMarketShares = [{ id: '1', risk }];
      mockMarketShareRepository.findAndCount.mockResolvedValue([
        mockMarketShares,
        1,
      ]);

      const result = await service.findByRisk(risk, 1, 10);
      expect(result).toEqual({
        data: {
          data: mockMarketShares,
          total: 1,
          page: 1,
          size: 10,
          totalPages: 1,
        },
        message: `Market shares com risco ${risk} encontrados com sucesso`,
      });
    });

    it('deve lançar BadRequestException para risco inválido', async () => {
      const invalidRisk = 'INVALID';
      await expect(service.findByRisk(invalidRisk)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('deve lançar BadRequestException se o ID não for UUID válido', async () => {
      const invalidId = '123';
      await expect(service.findOne(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar NotFoundException se o market share não for encontrado', async () => {
      const validId = '550e8400-e29b-41d4-a716-446655440000';
      mockMarketShareRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar o market share se encontrado', async () => {
      const validId = '550e8400-e29b-41d4-a716-446655440000';
      const mockMarketShare = { id: validId, name: 'Fundo A' };
      mockMarketShareRepository.findOne.mockResolvedValue(mockMarketShare);

      const result = await service.findOne(validId);
      expect(result).toEqual({
        data: mockMarketShare,
        message: `Market Share com ID ${validId} encontrado com sucesso`,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar os market shares paginados', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      const total = 2;
      mockMarketShareRepository.findAndCount.mockResolvedValue([
        mockData,
        total,
      ]);

      const result = await service.findAll(1, 10);
      expect(mockMarketShareRepository.findAndCount).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
      });
      expect(result).toEqual({
        data: {
          data: mockData,
          total,
          page: 1,
          size: 10,
          totalPages: Math.ceil(total / 10),
        },
        message: 'Lista de market shares carregada com sucesso',
      });
    });

    it('deve lançar erro ao tentar buscar market shares', async () => {
      mockMarketShareRepository.findAndCount.mockRejectedValue(
        new Error('Erro inesperado'),
      );

      await expect(service.findAll(1, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
