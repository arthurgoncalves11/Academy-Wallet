"use client";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useInvestment } from "@/contexts/investmentContext";
import "./css/style.css";
import LoadingWrapper from "./SkeletonWrapper";

interface Investment {
  id?: string;
  name: string;
  minDeposit: number;
  yearYield: string;
  redemption: string;
  risk: string;
}

const formatters = {
  currency: (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value),

  percentage: (value: string) => {
    const numValue = parseFloat(value.replace(",", "."));
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue / 100);
  },
};

const InvestmentCard: React.FC<Investment> = ({
  minDeposit,
  id,
  name,
  yearYield,
  redemption,
  risk,
}) => {
  const { setSelectedInvestment } = useInvestment();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formattedRisk = (risk: string) => {
    return risk
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^(\w)/, (char: string) => char.toUpperCase());
  };

  const getRiskColor = (risk: string) => {
    switch (formattedRisk(risk).toLocaleLowerCase()) {
      case "muito baixo":
        return "bg-[#5895FF]";
      case "baixo":
        return "bg-[#47A04B]";
      case "moderado":
        return "bg-[#F67E07]";
      case "alto":
        return "bg-red-500";
      case "muito alto":
        return "bg-[#710D06]";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-16 h-fit  bg-[#F8FAFC] grid grid-cols-7 my-2 rounded-md items-center relative">
      <LoadingWrapper
        loading={loading}
        skeletonHeight="20px"
        skeletonWidth="0.5rem"
      >
        <div
          className={`absolute left-0 w-2 h-full rounded-l-lg ${getRiskColor(
            risk
          )}`}
        ></div>
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonHeight="1.5rem"
        skeletonWidth="100px"
      >
        <div
          id="nameOfFund"
          className="py-3 lg:text-[0.9rem] col-span-2 md:text-[0.7rem] text-left px-4 font-semibold text-[#475569] "
        >
          {name}
        </div>
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonHeight="1.5rem"
        skeletonWidth="100px"
      >
        <div
          id="initialInvestment"
          className="py-3 lg:text-[0.9rem] text-center px-4 font-semibold text-[#475569] md:text-[0.7rem]"
        >
          {formatters.currency(minDeposit)}
        </div>
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonHeight="1.5rem"
        skeletonWidth="1rem"
      >
        <div
          id="performance"
          className="text-center lg:text-[0.9rem] font-semibold md:text-[0.7rem] text-[#475569] flex items-center justify-center"
        >
          <FontAwesomeIcon
            icon={yearYield.includes("-") ? faArrowDown : faArrowUp}
            className={`font-bold lg:text-[0.9rem] md:text-[0.7rem] ${yearYield.includes("-") ? "text-red-500" : "text-green-500"
              }
               mr-2`}
          />
          {formatters.percentage(yearYield)}
        </div>
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonHeight="1.5rem"
        skeletonWidth="100px"
      >
        <div
          id="redemption"
          className="text-center lg:text-[0.9rem] md:text-[0.7rem] font-semibold text-[#475569]"
        >
          {redemption}
        </div>
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonHeight="1.5rem"
        skeletonWidth="100px"
      >
        <div
          id="risk"
          className="text-center lg:text-[0.9rem] font-medium md:text-[0.7rem] text-[#475569]"
        >
          {formattedRisk(risk)}
        </div>
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonHeight="2rem"
        skeletonWidth="80px"
      >
        <div className="text-center lg:text-[0.9rem]  md:text-[0.7rem] flex items-center justify-center">
          <button
            id="initToInvestButton"
            onClick={() =>
              setSelectedInvestment({
                id: id,
              })
            }
            className="bg-white border-2 border-slate-200 lg:text-[0.9rem] lg:px-4 md:text-[0.7rem] md:px-2 py-2 rounded-lg"
          >
            Investir
          </button>
        </div>
      </LoadingWrapper>
    </div>
  );
};

export default InvestmentCard;
