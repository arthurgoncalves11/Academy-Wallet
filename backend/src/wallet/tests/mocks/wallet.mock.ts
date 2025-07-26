import { User } from '@/src/user/entities/user.entity';
import { Wallet } from '../../entities/wallet.entity';

export const userMock = {
  id: '123e4567-e89b-12d3-a456-426614174111',
  name: 'John Doe',
  email: 'john@example.com',
  loginPassword: 'hashedLoginPassword123',
  cpf: '12345678901',
  rg: '1234567890',
  firstAccess: true,
  recoverToken: null,
  recoverTokenTimestamp: null,
  cryptKey: null,
  deviceToken: null,
  wallet: null,
  notifications: [],
} as unknown as User;

export const walletMock = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  account: 123456789,
  agency: 1,
  organization: 380,
  transactionsPassword:
    '$2a$10$pmzagygIITj5clcgpH856u7hhDL4tKzQo/GEvWdaXWnJNeQCNFab23',
  user: userMock,
  currentAccount: {
    id: '123e4567-e89b-12d3-a456-426614174222',
    balance: 1000.0,
  },
  investments: [],
  transactions: [],
} as unknown as Wallet;

export const createWalletDtoMock = {
  transactionsPassword:
    '$2a$10$pmzagygIITj5clcgpH856u7hhDL4tKzQo/GEvWdaXWnJNeQCNFab2',
  account: 123456789,
  user: userMock,
};

export const homeWalletDtoMock = {
  data: {
    account: 123456789,
    agency: 1,
    organization: 380,
    name: userMock.name,
    email: userMock.email,
    balanceCurrentAccount: 1000.0,
    balanceInvestments: 2000.0,
  },
};
