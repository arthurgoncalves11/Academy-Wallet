"use client";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { InvestmentHeaderCard } from "./InvestmentHeaderCard";
import { useInvestment } from "@/contexts/investmentContext";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import jwt, { JwtPayload } from "jsonwebtoken";

const InvestmentHeader: React.FC = () => {
  const [isHidden, setIsHidden] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalAvailableForRedemption, setTotalAvailableForRedemption] = useState(0);
  const { selectedInvestment, setSelectedInvestment } = useInvestment();

  const handleGoBack = () => {
    setSelectedInvestment(null);
  };

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev);
  };

  const token = Cookies.get('token');

  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  let walletId: string = "";

  if (token) {
    const decoded = jwt.decode(token) as JwtPayload;
    walletId = decoded?.idWallet;
  }

  useEffect(() => {
    const fetchInvestmentSummary = async () => {
      try {
        const response = await fetch(`http://localhost:3000/investment/summary/${walletId}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar resumo de investimentos");
        }
        const data = await response.json();


        if (Array.isArray(data.data) && data.data.length === 0) {
          setTotalInvested(0);
          setTotalAvailableForRedemption(0);
        } else {
          setTotalInvested(data.data.totalInvested || 0);
          setTotalAvailableForRedemption(data.data.totalAvailableForRedemption || 0);
        }
      } catch (error) {
        console.error(error);
        setTotalInvested(0);
        setTotalAvailableForRedemption(0);
      }
    };

    fetchInvestmentSummary();
  }, [walletId]);

  return (
    <div className="w-full bg-white mb-4 rounded-md p-5">
      <div className="header-tittle flex justify-between items-center">
        {selectedInvestment?.id ? (
          <h1 className="font-semibold text-lg">
            <button
              className="text-[1.05rem] text-[#64748B] font-normal mr-1"
              onClick={handleGoBack}
            >
              <FontAwesomeIcon
                className="text-[0.9rem] text-[#64748B] font-normal mr-1  "
                icon={faChevronLeft}
              />
              Investimentos/{" "}
            </button>
            <span className="font-semibold text-lg">Investir</span>
          </h1>
        ) : (
          <h1 className="font-semibold text-lg">Investimentos</h1>
        )}
        <button
          id="hideBalance"
          onClick={toggleVisibility}
          className="text-2xl transition-all duration-200 active:scale-90  m-3 bg-slate-300/20 p-4 rounded-lg"
        >
          <FontAwesomeIcon icon={isHidden ? faEyeSlash : faEye} />
        </button>
      </div>

      <hr className="border-slate-300" />
      <section className="flex m-5 gap-4">
        <InvestmentHeaderCard
          title="Meus investimentos"
          totalLabel="Total investido"
          amount={totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          isHidden={isHidden}
          logoSrc="academy-hat.svg"
        />

        <InvestmentHeaderCard
          title="Disponível para resgate"
          totalLabel="Total de resgate"
          amount={totalAvailableForRedemption.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          isHidden={isHidden}
          logoSrc="redeem.svg"
          isDashed
        />
      </section>
    </div>
  );
};

export default InvestmentHeader;