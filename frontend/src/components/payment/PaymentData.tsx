"use client";
import { useState } from "react";
import {
  fetchBankSlip,
  fetchPayment,
  fetchUserData,
} from "@/app/api/payment/route";
import { useRouter } from "next/navigation";
import { JSX } from "react/jsx-runtime";
import {
  useBankSlip,
  usePaymentResult,
  useUser,
} from "@/contexts/paymentContext";
import { BankSlipResult, User } from "@/contexts/paymentContext";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentDataProps {
  children: ({
    inputValue,
    handleInputChange,
    handleSubmit,
    handleConfirmPayment,
    showNotificationError,
    notificationMessage,
    setShowNotificationError,
    isButtonDisabled,
    setNotificationMessage
  }: {
    inputValue: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => Promise<void>;
    handleConfirmPayment: (
      encryptedPassword: string,
      walletId: string,
      barcode?: string,
      name?: string,
      value?: number
    ) => Promise<void>;
    showNotificationError: boolean;
    notificationMessage: string;
    setShowNotificationError: React.Dispatch<React.SetStateAction<boolean>>;
    isButtonDisabled: boolean;
    setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
  }) => JSX.Element;
}

export default function PaymentData({ children }: PaymentDataProps) {
  const [inputValue, setInputValue] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showNotificationError, setShowNotificationError] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  const { setBankSlip } = useBankSlip();
  const { setUser } = useUser();
  const { setPaymentResult } = usePaymentResult();
  const { token } = useAuth();

  const router = useRouter();
  let bankSlipResult = {} as BankSlipResult;
  let userResult = {} as User;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setInputValue(value);
      setIsButtonDisabled(!(value.length === 44 || value.length === 47));
    }
  };

  const handleSubmit = async () => {
    try {
      bankSlipResult = await fetchBankSlip(inputValue, token);
      bankSlipResult.typeableLine = inputValue;
      setBankSlip(bankSlipResult);
    } catch (error) {
      if (
        (error as { status?: number }).status === 409 &&
        (error as { message?: string }).message === "Boleto expirado!"
      ) {
        setNotificationMessage("Este boleto já expirou");
        setShowNotificationError(true);
      } else if (
        (error as { status?: number }).status === 409 &&
        (error as { message?: string }).message === "Boleto ja esta pago"
      ) {
        setNotificationMessage("Este boleto já foi pago");
        setShowNotificationError(true);
      } else {
        setNotificationMessage("Código de barras inválido");
        setShowNotificationError(true);
      }
    }

    try {
      userResult = await fetchUserData(token);
      setUser(userResult);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        setNotificationMessage(
          "Algo deu errado. Tente novamente daqui a alguns minutos"
        );
        setShowNotificationError(true);
        console.error("User not found");
      }
    }

    if (
      Object.keys(bankSlipResult).length !== 0 &&
      Object.keys(userResult).length !== 0
    ) {
      bankSlipResult = {} as BankSlipResult;
      userResult = {} as User;
      router.push("/checking");
    }
  };

  const handleConfirmPayment = async (
    encryptedPassword: string,
    walletId: string,
    barcode?: string,
    name?: string,
    value?: number
  ) => {
    try {
      await fetchPayment(
        {
          transactionPassword: encryptedPassword,
          walletId,
          barcode,
          name,
          value: Number(value),
        },
        token
      );
      setPaymentResult((prevPaymentResult) => ({
        ...prevPaymentResult,
        sucess: true,
        message: "Pagamento realizado com sucesso",
      }));
      router.push("/payment");
    } catch (error) {
      if (
        (error as { status?: number }).status === 401 &&
        (error as { message?: string }).message ===
          "Senha transacional incorreta"
      ) {
        setPasswordAttempts(passwordAttempts + 1);
        setPaymentResult((prevPaymentResult) => ({
          ...prevPaymentResult,
          error: true,
          message: "Senha inválida",
        }));
        if (passwordAttempts === 3) {
          setPasswordAttempts(0);
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message:
              "Você ultrapassou o limite de tentativas para a senha de transação",
          }));
          router.push("/payment");
        }
      } else {
        if (
          (error as { status?: number }).status === 400 ||
          (error as { message?: string }).message === "Saldo insuficiente"
        ) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message:
              "Não foi possível realizar o pagamento. Saldo insuficiente",
          }));
        } else if (
          (error as { status?: number }).status === 409 ||
          (error as { message?: string }).message === "Boleto ja esta pago"
        ) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message: "Este boleto já foi pago",
          }));
        } else if (
          (error as { status?: number }).status === 403 ||
          (error as { message?: string }).message ===
            "Muitas tentativas. Tente novamente em 10 minutos."
        ) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message: "Muitas tentativas. Tente novamente em 10 minutos.",
          }));
        } else {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message:
              "Esse pagamento não foi realizado. Tente novamente daqui a alguns minutos",
          }));
        }
        router.push("/payment");
      }
    }
  };

  return children({
    inputValue,
    handleInputChange,
    handleSubmit,
    handleConfirmPayment,
    showNotificationError,
    notificationMessage,
    setShowNotificationError,
    isButtonDisabled,
    setNotificationMessage,
  });
}
