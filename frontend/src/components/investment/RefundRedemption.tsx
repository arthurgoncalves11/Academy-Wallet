import React, { useEffect, useState } from "react";
import { useInvestment } from "@/contexts/investmentContext"; // Importe o contexto
import RefundRedemptionContainer from "./RefundRedemptionContainer";
import RefundRedemptionEmptyState from "./RefundRedemptionEmptyState";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

interface RefundRedemptionProps {
  selectedRisks: string[];
  nameFilter: string;
}

export default function RefundRedemption({ }: RefundRedemptionProps) {
  const { selectedInvestment } = useInvestment();
  const [investmentData, setInvestmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado");
  }

  let walletId: string = "";

  if (token) {
    const decoded = jwt.decode(token) as JwtPayload;
    walletId = decoded?.idWallet;
  }

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/investment/wallet-investments/${walletId}`
        );
        if (!response.ok) {
          throw new Error("Erro ao carregar investimentos");
        }
        const data = await response.json();

        if (Array.isArray(data.data) && data.data.length === 0) {
          setInvestmentData(null);
        } else if (selectedInvestment != null) {
          const selected = data.data.flatMap((investment: any) => {
            const marketShare = investment.marketShares;


            if (marketShare && marketShare.id === selectedInvestment.id) {
              return [{
                ...marketShare,
                totalInvested: investment.totalInvested,
                totalAvailableForRedemption: investment.totalAvailableForRedemption,
              }];
            }

            return [];
          });

          setInvestmentData(selected[0] || null);
        }
      } catch (error) {
        console.error(error);
        setInvestmentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [walletId, selectedInvestment]);



  if (!investmentData) {
    return <RefundRedemptionEmptyState />;
  }

  return (
    <div>
      <RefundRedemptionContainer investmentData={investmentData} />
    </div>
  );
}
