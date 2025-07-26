"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode
} from 'react';

export interface BankSlipResult {
  typeableLine: string;
  account: string;
  agency: string;
  barcode: string;
  cpfOrCnpj: string;
  dateForExpirate: string;
  dateToOperation: string;
  dateToPay: string;
  discount: number;
  fees: number;
  institution: string;
  legalName: string;
  nameBank: string;
  nameFantasy: string;
  nominalValue: number;
  penalty: number;
  valueToPay: number;
}

export interface User {
  name: string;
  cpf: string;
}

export interface PaymentResult {
  sucess: boolean;
  error: boolean;
  message:string
}

interface BankSlipContextType {
  bankSlip: BankSlipResult;
  setBankSlip: React.Dispatch<React.SetStateAction<BankSlipResult>>;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

interface PaymentResultContextType {
  paymentResult: PaymentResult;
  setPaymentResult: React.Dispatch<React.SetStateAction<PaymentResult>>;
}

const BankSlipContext = createContext<BankSlipContextType>({
  bankSlip: {} as BankSlipResult,
  setBankSlip: () => { }
});

const UserContext = createContext<UserContextType>({
  user: {} as User,
  setUser: () => { }
});

const PaymentResultContext = createContext<PaymentResultContextType>({
  paymentResult: {} as PaymentResult,
  setPaymentResult: () => { }
})

export const BankSlipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bankSlip, setBankSlip] = useState<BankSlipResult>({} as BankSlipResult);

  return (
    <BankSlipContext.Provider value={{ bankSlip, setBankSlip }}>
      {children}
    </BankSlipContext.Provider>
  );
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({} as User);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const PaymentResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentResult, setPaymentResult] = useState<PaymentResult>({} as PaymentResult)

  return (
    <PaymentResultContext.Provider value={{ paymentResult, setPaymentResult }}>
      {children}
    </PaymentResultContext.Provider>
  )
}

export const useBankSlip = () => {
  const context = useContext(BankSlipContext);

  if (!context) {
    throw new Error('useBankSlip must be used within a BankSlipProvider');
  }

  return context;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }

  return context;
};

export const usePaymentResult = () => {
  const context = useContext(PaymentResultContext);

  if (!context) {
    throw new Error('usePaymentResult must be used within a PaymentResultContextProvider');
  }

  return context;
};