"use client";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import Image from "next/image";
import LoadingWrapper from "./SkeletonWrapper";

interface InvestmentCardProps {
  title: string;
  totalLabel: string;
  amount: string;
  isHidden: boolean;
  logoSrc: string;
  isDashed?: boolean;
}

export const InvestmentHeaderCard: FC<InvestmentCardProps> = ({
  title,
  totalLabel,
  amount,
  isHidden,
  logoSrc,
  isDashed = false,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simula o tempo de carregamento
    return () => clearTimeout(timer);
  }, []);
  const [loading, setLoading] = useState(true);

  return (
    <section
      className={`${isDashed ? "border-2 border-dashed" : "bg-[#F8FAFC]"
        } w-1/2 rounded-md p-3 flex flex-col h-44 justify-between`}
    >
      <div className="tittle-investments flex items-center h-16">
        <LoadingWrapper
          loading={loading}
          skeletonHeight="2.60rem"
          skeletonWidth="2.60rem"
        >
          <div
            className={`logo-tittle p-3 rounded-md m-2 ${isDashed ? "border-green-400/20 border-2" : "bg-[#00253F]"
              }`}
          >

            <Image
              src={logoSrc}
              width={24}
              height={24}
              alt="logo"
              className="w-6 h-6"
            />
          </div>
        </LoadingWrapper>
        <LoadingWrapper
          loading={loading}
          skeletonHeight="1rem"
          skeletonWidth="7rem"
        >
          <h3 className="w-4/5 font-semibold md:text-[0.9rem]">{title}</h3>
        </LoadingWrapper>
      </div>
      <div className="investment-values">
        <LoadingWrapper
          loading={loading}
          skeletonHeight="1rem"
          skeletonWidth="7rem"
        >
          <h4 className="md:text-[0.9rem]">{totalLabel}</h4>
        </LoadingWrapper>
        <LoadingWrapper
          loading={loading}
          skeletonHeight="1rem"
          skeletonWidth="7rem"
        >
          <h4>
            <span className="font-semibold">R$</span>{" "}
            {isHidden ? "••••••" : amount}
          </h4>
        </LoadingWrapper>
      </div>
    </section>
  );
};
