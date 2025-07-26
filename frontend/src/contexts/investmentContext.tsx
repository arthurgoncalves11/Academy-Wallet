"use client"
import React, { createContext, useState, useContext } from "react";

interface InvestmentData {
  cnpj?: string;
  id?: string;
  minDeposit?: number;
  name?: string;
  performance?: string;
  risk?: string;
  yearYield?: number;
  dayYield?: number;
  daysToRetrieve?: number;
  createdAt?: string;
  benchmark?: string;
  marketValue?: number;
  manager?: string;
  shareKeeper?: string;
  marketValueYearAvg?: number;
  redemption?: string;
  isBought?: boolean;
}

interface InvestmentContextType {
  selectedInvestment: InvestmentData | null;
  setSelectedInvestment: (investment: InvestmentData | null) => void;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentData | null>(null);

  return (
    <InvestmentContext.Provider value={{ selectedInvestment, setSelectedInvestment }}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error("useInvestment deve ser usado dentro de um InvestmentProvider");
  }
  return context;
};
