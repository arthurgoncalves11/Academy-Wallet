import { CreateUserDto } from '@/src/user/dto/create-user.dto';

export const createUserMock: CreateUserDto = {
  name: 'João Silva',
  email: 'joao.silva@example.com',
  loginPassword: 'SenhaSegura123!',
  cpf: '529.982.247-25',
  rg: '123456789',
  transactionsPassword: '123456',
};
