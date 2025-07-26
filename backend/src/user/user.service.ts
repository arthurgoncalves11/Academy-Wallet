import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { WalletService } from '@/src/wallet/wallet.service';
import { PasswordService } from '@/src/common/services/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserData, UserResponseDto } from './dto/user-response.dto';
import logger from '../../logger';
import { REQUEST } from '@nestjs/core';
import { UserCreatedDto } from './dto/user-created.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly walletService: WalletService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.loginPassword = this.passwordService.hashPassword(
      createUserDto.loginPassword,
    );

    logger.info('Criando usuario');
    const newUserEntity = this.userRepository.create(createUserDto);

    return await this.saveUserAndCreateWallet(
      newUserEntity,
      createUserDto.transactionsPassword,
    );
  }

  async saveUserAndCreateWallet(
    newUserEntity: User,
    transactionsPassword: string,
  ): Promise<UserCreatedDto> {
    try {
      logger.info('Salvando usuário');
      const { id, email } = await this.userRepository.save(newUserEntity);

      await this.walletService.create(transactionsPassword, newUserEntity);
      return { data: { id, email } };
    } catch (QueryFailedError) {
      let duplicatedField: string = 'E-mail ou CPF';
      switch (QueryFailedError.constraint) {
        case 'usr_uk_email':
          duplicatedField = 'E-mail';
          break;
        case 'usr_uk_cpf':
          duplicatedField = 'CPF';
          break;
      }
      throw new ConflictException(`${duplicatedField} já cadastrado.`);
    }
  }

  async findFullUserByWithoutWallet(
    field: 'id' | 'email',
    value: string,
  ): Promise<User | null> {
    const userFound = await this.userRepository.findOne({
      where: { [field]: value },
    });

    if (!userFound) {
      return null;
    }

    return userFound;
  }

  async findFullUserBy(
    field: 'id' | 'email',
    value: string,
  ): Promise<User | null> {
    const userFound = await this.userRepository.findOne({
      where: { [field]: value },
      relations: {
        wallet: { currentAccount: true },
      },
    });

    if (!userFound) {
      return null;
    }

    return userFound;
  }

  async findUser(): Promise<UserResponseDto> {
    const userId = this.extractUserIdFromToken();
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        wallet: { currentAccount: true },
      },
    });

    if (!userFound)
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);

    return this.mapToUserResponseDto(userFound);
  }

  private mapToUserResponseDto(userEntity: User): UserResponseDto {
    const userPlain = plainToInstance(UserData, userEntity);

    return {
      data: {
        id: userPlain.id,
        name: userPlain.name,
        email: userPlain.email,
        rg: userPlain.rg,
        cpf: userPlain.cpf,
        firstAccess: userPlain.firstAccess,
        wallet: userPlain.wallet,
      },
    };
  }

  async updateFirstAccess(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    logger.info(`FindOne user(${user?.id})`);

    if (!user) {
      throw new NotFoundException(`ID não encontrado.`);
    }

    await this.userRepository.update(id, {
      firstAccess: !user.firstAccess,
    });

    logger.info(`Campo firstAccess alterado para ${!user.firstAccess}.`);

    return {
      message: `Campo firstAccess alterado para ${!user.firstAccess}.`,
    };
  }

  async update(userId: string, user: User) {
    await this.userRepository.update(userId, user);
  }

  async findOneByOrFail(field: 'id' | 'email', value: string) {
    const user = await this.findFullUserBy(field, value);

    if (!user)
      throw new NotFoundException(
        `Usuário com ${field} ${value} não encontrado`,
      );

    return user;
  }

  async registerDeviceToken(token: string) {
    return await this.userRepository.update(this.extractUserIdFromToken(), {
      deviceToken: token,
    });
  }

  extractUserIdFromToken() {
    try {
      const userFromToken = this.request['user'];

      return userFromToken.sub;
    } catch (error) {
      logger.error(error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
