"use client";

import React, { useEffect, useState, useRef } from "react";
import InvestmentCard from "./InvestmentCard";
import { If } from "./IF";
import EmptyPageInvestments from "./InvestmentsEmptyState";

interface InvestmentData {
  minDeposit: number;
  id?: string;
  name: string;
  yearYield: string;
  redemption: string;
  risk: string;
}

interface InvestmentProps {
  selectedRisks: string[];
  nameFilter: string;
}

export default function Investment({
  selectedRisks,
  nameFilter,
}: InvestmentProps) {
  const [investments, setInvestments] = useState<InvestmentData[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<
    InvestmentData[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const isFetching = useRef(false); // Garante que a requisição não seja disparada múltiplas vezes

  const carregarDados = async (currentPage: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    try {
      const resposta = await fetch(
        `/api/investment?page=${currentPage}&size=10`
      );
      if (!resposta.ok) throw new Error("Erro ao buscar investimentos");

      const responseData = await resposta.json();

      const { data } = responseData;

      if (!Array.isArray(data.data)) {
        throw new Error("Expected data.data to be an array");
      }

      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setInvestments((prev) =>
          currentPage === 1 ? data.data : [...prev, ...data.data]
        );
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    carregarDados(1);
  }, []);

  useEffect(() => {
    const filteredByRisk = selectedRisks.length > 0
      ? investments.filter((investment) => {
        const formattedRisk = investment.risk
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/^(\w)/, (char) => char.toUpperCase());

        return selectedRisks
          .map((risk) => risk.toLowerCase())
          .includes(formattedRisk.toLowerCase());
      })
      : investments;

    const filteredByName = nameFilter
      ? filteredByRisk.filter((investment) =>
        investment.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
      : filteredByRisk;

    setFilteredInvestments(filteredByName);
  }, [selectedRisks, nameFilter, investments]);



  const carregarMais = () => {
    if (!hasMore || loading) return;
    carregarDados(page + 1);
  };

  return (
    <div>
      <If condition={filteredInvestments.length === 0}>
        <EmptyPageInvestments />
      </If>
      <If condition={filteredInvestments.length > 0}>
        <div className="mt-4">
          <div className="grid grid-cols-7 text-center text-sm mx-6">
            <div className="py-2 text-left md:text-[0.8rem] lg:text-[0.9rem] px-2 col-span-2">
              Nome do fundo
            </div>
            <div className="py-2 md:text-[0.8rem] lg:text-[0.9rem]">
              Aplicação inicial
            </div>
            <div className="py-2 md:text-[0.8rem] lg:text-[0.9rem]">
              Em 12 meses
            </div>
            <div className="py-2 md:text-[0.8rem] lg:text-[0.9rem]">
              Resgate
            </div>
            <div className="py-2 md:text-[0.8rem] lg:text-[0.9rem]">Risco</div>
            <div className="py-2 md:text-[0.8rem] lg:text-[0.9rem]">Ações</div>
          </div>

          <div className="m-4 grid">
            {filteredInvestments.map((investment, index) => (
              <InvestmentCard key={index} {...investment} />
            ))}
          </div>

          <div className="w-full flex h-16 items-center justify-center text-[#334155]">
            <button
              onClick={carregarMais}
              disabled={!hasMore || loading}
              className="w-34 bg-white transition-all duration-200 active:scale-90 border py-2 text-sm font-normal px-2 rounded-lg"
              style={{ display: hasMore ? 'inline-block' : 'none' }}
            >
              Carregar mais
            </button>
          </div>

        </div>
      </If>
    </div>
  );
}
