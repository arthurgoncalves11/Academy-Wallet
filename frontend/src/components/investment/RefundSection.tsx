import React, { useState } from "react";
import { If } from "./IF";
import { PinInputDialog } from "../PasswordDialog";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { usePaymentResult } from "@/contexts/paymentContext";

type RefundSectionProps = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  textValueColor: string;
  isRescue: boolean;
  minDeposit: number;
  initialValue: number;
  marketShareId: string;
  totalRedemption?: number;
};

const RefundSection: React.FC<RefundSectionProps> = ({
  title,
  subtitle,
  textValueColor,
  paragraphs,
  isRescue,
  initialValue,
  marketShareId,
  minDeposit,
  totalRedemption,
}) => {
  const [value, setValue] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const { setPaymentResult } = usePaymentResult()

  const formatCurrency = (input: string) => {
    const numericValue = Number(input.replace(/\D/g, "")) / 100;
    return numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatCurrency(inputValue);
    setValue(formattedValue);

    const numericValue = Number(
      formattedValue.replace("R$", "").replace(".", "").replace(",", ".")
    );
    setIsButtonActive(numericValue > 0 && numericValue <= 1000);
  };
  const handleInvestment = async (
    encryptedPassword: string,
    walletId: string,
    _?: number,
    marketShareId?: string
  ) => {
    try {
      const token = Cookies.get('token');

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const numericValue = Number(value.replace("R$", "").replace(/\./g, "").replace(",", "."));

      console.log("valores passados, initialValue:", numericValue, typeof numericValue);

      const response = await fetch("http://localhost:3000/investment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          initialValue: numericValue,
          walletId,
          transactionsPassword: encryptedPassword,
          marketShareId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPasswordAttempts(passwordAttempts + 1);
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message: "Senha inválida",
          }));

        }
        if (response.status === 403) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: false,
            message: " ",
          }));
          setPasswordAttempts(0);
          toast.error("Você ultrapassou o limite de tentativas para a senha de transação");
        }
        if (response.status === 400) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: false,
            message: " ",
          }));
          setPasswordAttempts(0);
          toast.error("Saldo insuficiente na conta corrente");
        }
      } else {
        setPaymentResult((prevPaymentResult) => ({
          ...prevPaymentResult,
          error: false,
          message: " ",
        }));
        toast.success("Investimento realizado com sucesso!");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao realizar o investimento.");
    }

  };

  const handleBuyInvestment = async (
    encryptedPassword: string,
    walletId: string,
    _?: number,
    marketShareId?: string
  ) => {
    try {
      const token = Cookies.get('token');

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }
      const numericValue = Number(value.replace("R$", "").replace(/\./g, "").replace(",", "."));

      const response = await fetch("http://localhost:3000/investment/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          walletId,
          marketShareId,
          amount: numericValue,
          transactionsPassword: encryptedPassword,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPasswordAttempts(passwordAttempts + 1);
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: true,
            message: "Senha inválida",
          }));

        }
        if (response.status === 403) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: false,
            message: " ",
          }));
          setPasswordAttempts(0);
          toast.error("Você ultrapassou o limite de tentativas para a senha de transação");
        }
        if (response.status === 400) {
          setPaymentResult((prevPaymentResult) => ({
            ...prevPaymentResult,
            error: false,
            message: " ",
          }));
          setPasswordAttempts(0);
          toast.error("Saldo insuficiente na conta corrente");
        }
      } else {
        setPaymentResult((prevPaymentResult) => ({
          ...prevPaymentResult,
          error: false,
          message: " ",
        }));
        toast.success("Resgate concluído com sucesso");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao realizar o resgate.");
    }

  };


  return (
    <div className="text-center rounded-lg w-full p-2 my-20 max-w-md mx-auto">
      <h2 className="font-semibold text-xl mb-10">{title}</h2>

      <input
        id="RedemptionValueInput"
        maxLength={21}
        type="text"
        value={value}
        onFocus={(event) => event.target.select()}
        onChange={handleChange}
        placeholder="  R$ 0,00"
        className={`text-center text-4xl border-b border-[#CBD5E1] px-4 py-2 font-semibold mb-1 
          focus:border-[#a1a1a1] focus:outline-none w-full ${textValueColor}`}
      />
      <h2 className="mt-10 mb-2 text-[1.1rem]">{subtitle}</h2>
      <If condition={isRescue}>
        <p className="font-semibold text-[#245026] text-[1.2rem]">
          Total para resgate: {totalRedemption? totalRedemption.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : totalRedemption}
        </p>
      </If>

      {paragraphs.map((text, index) => (
        <p key={index} className={`mb-1 text-[#64748B] font-normal`}>
          {text}
        </p>

      ))}

      <If condition={isRescue}>
        <PinInputDialog
          initialValue={Number(value.replace("R$", "").replace(/\./g, "").replace(",", "."))}
          marketShareId={marketShareId}
          confirmButtonText="Confirmar resgate"
          onConfirmInvestment={handleBuyInvestment}
          triggerButton={
            <button
              id="RedemptionButton"
              disabled={
                Number(
                  value.replace("R$", "").replace(/\./g, "").replace(",", ".")
                ) < minDeposit
              }
              className={`${Number(
                value.replace("R$", "").replace(/\./g, "").replace(",", ".")
              ) >= minDeposit
                ? "bg-[#00253F] hover:bg-[#00102F]"
                : "bg-[#00253F]/50 cursor-not-allowed"
                } w-full max-w-[300px] text-sm py-6 px-4 rounded-lg transition mt-4 text-white`}
            >
              Resgatar
            </button>
          }
        />
      </If>

      {/* Botão de Investir */}
      <If condition={!isRescue}>
        <PinInputDialog
          initialValue={initialValue}
          marketShareId={marketShareId}
          confirmButtonText="Confirmar investimento"
          onConfirmInvestment={handleInvestment}
          triggerButton={
            <button
              id="investmentButton"
              disabled={
                Number(
                  value.replace("R$", "").replace(/\./g, "").replace(",", ".")
                ) < minDeposit
              }
              className={`${Number(
                value.replace("R$", "").replace(/\./g, "").replace(",", ".")
              ) >= minDeposit
                ? "bg-[#00253F] hover:bg-[#00102F]"
                : "bg-[#00253F]/50 cursor-not-allowed"
                } w-full max-w-[300px] text-sm py-6 px-4 rounded-lg transition mt-4 text-white`}
            >
              Investir
            </button>
          }
        />
      </If>
    </div>
  );
};

export default RefundSection;

