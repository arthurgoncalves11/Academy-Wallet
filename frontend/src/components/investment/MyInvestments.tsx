"use client";
import React, { useEffect, useState } from "react";
import MyInvestmentsContainer from "./MyInvestmentsContainer";
import { EmptyPageMyInvestments } from "./MyInvestmentsEmptyState";
import Cookies from 'js-cookie';
import jwt, { JwtPayload } from "jsonwebtoken";
import { If } from "./IF";

interface MyInvestmentsProps {
  selectedRisks: string[];
  nameFilter: string;
}

interface MarketShare {
  id: string;
  name: string;
  cnpj: string;
  minDeposit: string;
  yearYield: string;
  risk: string;
  dayYield: string;
  daysToRetrieve: number;
  benchmark: string;
  marketValue: string;
  createdAt: string;
  shareKeeper: string;
  manager: string;
  marketValueYearAvg: string;
  redemption: string;
  totalInvested: string;
  totalAvailableForRedemption: string;
}

interface InvestmentData {
  id: string;
  marketShares: MarketShare[];
}

export function MyInvestments({
  selectedRisks,
  nameFilter,
}: MyInvestmentsProps) {
  const [investments, setInvestments] = useState<InvestmentData[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!walletId) return;

    console.log("wallet id:", walletId)

    const fetchInvestments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/investment/wallet-investments/${walletId}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar investimentos");
        }
        const data = await response.json();
        console.log("data: ", data)

        if (Array.isArray(data.data) && data.data.length === 0) {
          setInvestments([]);
        } else {
          setInvestments(data.data);
        }
      } catch (error) {
        console.error(error);
        setInvestments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [walletId]);

  return (
    <div>
      <If condition={investments.length === 0}>
        <EmptyPageMyInvestments
          setActiveTab={function (tab: "investment" | "myInvestment"): void {
            console.log(tab);
            throw new Error("Function not implemented.");
          }}
        />
      </If>
      <If condition={investments.length > 0}>
        <MyInvestmentsContainer
          setActiveTab={() => { }}
          selectedRisks={selectedRisks}
          nameFilter={nameFilter}
          investments={investments}
        />
      </If>
    </div>
  );
}