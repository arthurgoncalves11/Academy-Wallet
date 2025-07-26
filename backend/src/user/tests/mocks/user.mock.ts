import { User } from '@/src/user/entities/user.entity';
import { Wallet } from '@/src/wallet/entities/wallet.entity';
import { UserData, UserResponseDto } from '../../dto/user-response.dto';

export const userMock: User = {
  id: '55ff1aa8-236d-42c1-8c14-5d49b7d7a107',
  name: 'John Doe',
  email: 'john@gmail.com',
  rg: '344805281',
  cpf: '98765432100',
  firstAccess: true,
  loginPassword: '$2b$10$YwEWpxEJ372jjXEQw2Zcw.dFEPOV.2WtBxD4KbzV5tt9Q1WZrBJse',
  recoverToken: '',
  recoverTokenTimestamp: new Date(),
  cryptKey: null,
  notifications: [],
  deviceToken: null,
  wallet: {
    id: 'af6fa759-8d19-435e-a4bf-ad2f7021abab',
    agency: 1,
    account: 236592348,
    organization: 380,
    transactionsPassword:
      '$2b$10$xKJt0jVDgWZ4tuJ1AnPT8ujVTkov72dm.Yigpdh9CWLHdYGN0hBLq',
    currentAccount: {
      id: 'ed2b92ca-dec1-4895-8e84-534b533aa5dd',
      balance: 0.0,
      wallet: new Wallet(),
    },
  } as Wallet,
};

export const userResponseMock: UserData = {
  id: '55ff1aa8-236d-42c1-8c14-5d49b7d7a107',
  name: 'John Doe',
  email: 'john@gmail.com',
  cpf: '98765432100',
  rg: '344805281',
  firstAccess: true,
  wallet: {
    data: {
      id: 'af6fa759-8d19-435e-a4bf-ad2f7021abab',
      agency: 1,
      account: 236592348,
      organization: 380,
      currentAccount: {
        id: 'ed2b92ca-dec1-4895-8e84-534b533aa5dd',
        balance: 0,
      },
      transactionsPassword: '45665443',
    },
  },
};
