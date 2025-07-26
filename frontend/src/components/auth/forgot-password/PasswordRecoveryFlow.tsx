"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormForgotPasswordStepOne } from "./FormForgotPasswordStepOne";
import { FormForgotPasswordStepTwo } from "./FormForgotPasswordStepTwo";
import { FormForgotPasswordStepThree } from "./FormForgotPasswordStepThree";

interface ApiResponse {
  message: string;
}

interface ValidateOtpResponse {
  message: string;
  data: {recoverPasswordToken:string};
}

export const PasswordRecoveryFlow: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleEmailSubmit = async (submittedEmail: string) => {

    try {    

      const response = await fetch("http://localhost:3000/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: submittedEmail }),
      });

      const responseData: ApiResponse = await response.json();
     

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Email não cadastrado");
          return;
        }

        if (response.status === 500) {
         
          toast.error(
            "Erro interno do servidor. Por favor, tente novamente mais tarde."
          );
          return;
        }

        toast.error(responseData.message || "Erro ao processar solicitação");
        return;
      }

      setEmail(submittedEmail);
      setCurrentStep(2);
      toast.success(
        "Código enviado com sucesso! Verifique sua caixa de entrada."
      );
    } catch {     
      toast.error("Erro ao processar solicitação. Tente novamente.");
    }
  };

  const handleOtpSubmit = async (otpCode: string) => {
   
    try {
      
      const response = await fetch("http://localhost:3000/auth/validate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token: otpCode }),
      });

      if (response.status === 403) {
        toast.error(
          "Limite de tentativas excedido. Tente novamente em 10 minutos."
        );
        return false;
      }

      const data: ValidateOtpResponse = await response.json();      

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Código inválido. Tente novamente.");
        } else {
          toast.error(data.message || "Erro ao validar código");
        }
        return false;
      }

      setToken(data.data.recoverPasswordToken);
      setCurrentStep(3);
      toast.success("Código validado com sucesso!");
      return true;
    } catch {
    
      toast.error("Erro ao verificar código. Tente novamente.");
      return false;
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao reenviar código");
      }

      toast.success("Novo código enviado com sucesso!");
    } catch {
      
      toast.error("Erro ao reenviar código. Tente novamente.");
    }
  };

  const handlePasswordSubmit = async ({ password }: { password: string }) => {
    try {
     
      const response = await fetch(
        "http://localhost:3000/auth/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword: password,
          }),
        }
      );     

      if (response.status === 401) {
        toast.error("Sessão expirada. Por favor, reinicie o processo.");
        setCurrentStep(1);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao alterar senha");
      }

      toast.success("Senha alterada com sucesso!");
      router.push("/");
    } catch{
   
      toast.error("Erro ao alterar senha. Tente novamente.");
    }
  };

  const handleBack = () => setCurrentStep(currentStep - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FormForgotPasswordStepOne onSubmit={handleEmailSubmit} />;
      case 2:
        return (
          <FormForgotPasswordStepTwo
            email={email}
            onSubmit={handleOtpSubmit}
            onBack={handleBack}
            onResendCode={handleResendCode}
          />
        );
      case 3:
        return (
          <FormForgotPasswordStepThree
            onSubmit={handlePasswordSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return renderStep();
};
