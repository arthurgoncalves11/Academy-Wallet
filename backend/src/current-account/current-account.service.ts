import { Injectable } from '@nestjs/common';
import { CreateCurrentAccountDto } from './dto/create-current-account.dto';
import { UpdateCurrentAccountDto } from './dto/update-current-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentAccount } from './entities/current-account.entity';
import { Repository } from 'typeorm';
import { Wallet } from '@/src/wallet/entities/wallet.entity';
import logger from '../../logger';

@Injectable()
export class CurrentAccountService {
  constructor(
    @InjectRepository(CurrentAccount)
    private readonly currentAccountRepository: Repository<CurrentAccount>,
  ) {}

  async create(wallet: Wallet) {
    logger.info('Criando conta corrente');
    const createCurrentAccountDto = new CreateCurrentAccountDto(wallet, 0);

    const newCurrentAccount = this.currentAccountRepository.create(
      createCurrentAccountDto,
    );
    logger.info('Salvando conta corrente');
    await this.currentAccountRepository.save(newCurrentAccount);
  }

  findAll() {
    return `This action returns all currentAccount`;
  }

  findOne(id: string) {
    return this.currentAccountRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateCurrentAccountDto: UpdateCurrentAccountDto) {
    return this.currentAccountRepository.update(id, updateCurrentAccountDto);
  }

  remove(id: number) {
    return `This action removes a #${id} currentAccount`;
  }
}
