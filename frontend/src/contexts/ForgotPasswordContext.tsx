'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

interface ForgotPasswordData {
  email: string;
  otp: string;
}

interface ForgotPasswordContextData {
  formData: ForgotPasswordData;
  currentStep: number;
  validateEmail: (email: string) => Promise<void>;
  validateOtp: (otp: string) => Promise<void>;
  prevStep: () => void;
  resetForm: () => void;
}

const ForgotPasswordContext = createContext({} as ForgotPasswordContextData);

export function ForgotPasswordProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
    otp: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  const validateEmail = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Email não cadastrado no sistema');
          return;
        }
        throw new Error('Erro ao processar solicitação');
      }

      setFormData(prev => ({ ...prev, email }));
      setCurrentStep(2);
      toast.success('Código enviado para seu email!');

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar solicitação. Tente novamente.');
    }
  };

  const validateOtp = async (otp: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          otp 
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          toast.error('Código inválido ou expirado');
          return;
        }
        throw new Error('Erro ao verificar código');
      }

      setFormData(prev => ({ ...prev, otp }));
     
     

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao verificar código. Tente novamente.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetForm = () => {
    setFormData({ email: '', otp: '' });
    setCurrentStep(1);
  };

  return (
    <ForgotPasswordContext.Provider value={{
      formData,
      currentStep,
      validateEmail,
      validateOtp,
      prevStep,
      resetForm
    }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
}

export const useForgotPassword = () => useContext(ForgotPasswordContext);