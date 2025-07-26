import React, { useState, useEffect } from "react";
import LoadingWrapper from "./SkeletonWrapper";
import RefundSection from "./RefundSection";
import { useInvestment } from "@/contexts/investmentContext";

interface InvestmentData {
  id: string;
  name: string;
  cnpj: string;
  minDeposit: number;
  yearYield: number;
  risk: string;
  dayYield: number;
  daysToRetrieve: number;
  benchmark: string;
  marketValue: number;
  createdAt: string;
  manager: string;
  shareKeeper: string;
  marketValueYearAvg: number;
  redemption: string;
}

interface MyInvestmentsProps {
  setActiveTab: (tab: string) => void;
}

const RefundRedemption: React.FC<MyInvestmentsProps> = ({ setActiveTab }) => {
  const { selectedInvestment } = useInvestment();
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<InvestmentData | null>(null);


  useEffect(() => {
    if (!selectedInvestment?.id) return;

    const fetchInvestmentData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/market-share/${selectedInvestment.id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar investimentos");
        }
        const responseData = await response.json();

        if (!responseData.data) {
          throw new Error("Dados do investimento não encontrados");
        }

        setInvestments(responseData.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do investimento:", error);
      }
    };

    fetchInvestmentData();
  }, [selectedInvestment?.id]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatRisk = (risk: string) => {
    if (!risk) return "Indefinido";
    return risk
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^(\w)/, (char) => char.toUpperCase());
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };  

  const date = (date: string) => new Date(date).toLocaleDateString("pt-BR");


  const getRiskBorderColor = (risk: string) => {
    const formattedRisk = risk
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^(\w)/, (char) => char.toUpperCase());

    switch (formattedRisk) {
      case "Muito baixo":
        return "border-[#5895FF]";
      case "Baixo":
        return "border-[#47A04B]";
      case "Moderado":
        return "border-[#F67E07]";
      case "Alto":
        return "border-red-500";
      case "Muito alto":
        return "border-[#710D06]";
      default:
        return "border-gray-500";
    }
  };



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };


  return (
    <div>
      {selectedInvestment && (
        <div key={selectedInvestment.id}>
          {/* Cabeçalho com informações principais */}
          <div
            className={`bg-[#F8FAFC] border-l-[6px] ${investments ? getRiskBorderColor(
              investments.risk
            ) : " "} rounded-lg w-fill p-2 m-6 cursor-pointer`}
          >
            <header className="flex items-center justify-evenly">
              <div className="flex justify-between w-full my-2 mx-1">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="230px"
                  skeletonHeight="30px"
                >
                  <h1 id="InvestmentName" className="font-semibold content-center text-gray-800">
                    {investments ? investments.name : "undefined"}
                  </h1>
                </LoadingWrapper>
              </div>
            </header>

            <hr className="border-[#E2E8F0]" />

            {/* Informações principais */}
            <main className="grid lg:grid-cols-4 p-2 my-2">
              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Aplicação inicial mín.</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="minDeposit" className="text-[#475569] font-semibold">
                    {investments ? formatNumber(Number(investments.minDeposit)) : 10}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="130px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Taxa fixa diária</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="70px"
                  skeletonHeight="30px"
                >
                  <p id="dayYield" className="text-[#475569] font-semibold">
                    {investments ? investments.dayYield : 11}%
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="130px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Grau de risco</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="80px"
                  skeletonHeight="30px"
                >
                  <p id="investmentRisk" className="text-[#475569] font-semibold">
                    {investments ? formatRisk(investments.risk) : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>


            </main>
          </div>

          {/* Seção para resgatar o investimento */}
          <RefundSection
            title="Quanto você quer investir?"
            subtitle="Importante"
            paragraphs={[
              `O valor da aplicação mínima do fundo é de R$ ${investments ?formatNumber(Number(investments.minDeposit))  : 1000}`,
            ]}
            isRescue={false}
            textValueColor={"placeholder:text-[#0055E7] text-[#0055E7]"}
            minDeposit={investments ? investments.minDeposit : 1000}
            initialValue={investments ? investments.minDeposit : 1000} // Passando initialValue
            marketShareId={selectedInvestment.id || " "} // Passando marketShareId
          />


          {/* Seção de informações detalhadas */}
          <div className="bg-[#F8FAFC] rounded-lg w-fill p-2 m-6">
            <footer className="grid lg:grid-cols-4 gap-4">
              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">CNPJ</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="investmentCNPJ" className="text-[#475569] font-semibold">
                    {investments ? investments.cnpj : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Gestor</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="investmentManager" className="text-[#475569] font-semibold">
                    {investments ? investments.manager : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Custodiante</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="shareKeeper" className="text-[#475569] font-semibold">
                    {investments ? investments.shareKeeper : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Data de início</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="createdAt" className="text-[#475569] font-semibold">
                    {investments ? date(investments.createdAt) : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Benchmark</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="benchMark" className="text-[#475569] font-semibold">
                    {investments ? investments.benchmark : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Rentabilidade (ano)</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="yearYield" className="text-[#475569] font-semibold">
                    {investments ? investments.yearYield : "undefined"}%
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Dias para resgate</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="daysToRetrieve" className="text-[#475569] font-semibold">
                    D+{investments ? investments.daysToRetrieve : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>
              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Cotização da aplicação</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="daysToRetrieve" className="text-[#475569] font-semibold">
                    D+{investments ? investments.daysToRetrieve : "undefined"}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="130px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">Patrimônio líquido médio 12 meses</h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="investmentsMarketValue" className="text-[#475569] font-semibold">
                    {formatCurrency(investments ? investments.marketValueYearAvg : 1000)}
                  </p>
                </LoadingWrapper>
              </div>

              <div className="my-2 w-[200px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="160px"
                  skeletonHeight="30px"
                >
                  <h3 className="text-[#64748B]">
                    Patrimônio líquido
                  </h3>
                </LoadingWrapper>
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="100px"
                  skeletonHeight="30px"
                >
                  <p id="marketValueYearAVG" className="text-[#475569] font-semibold">
                    {formatCurrency(investments ? investments.marketValue : 10000)}
                  </p>
                </LoadingWrapper>
              </div>
            </footer>
          </div>
        </div>

      )}

    </div>
  );
};

export default RefundRedemption;
