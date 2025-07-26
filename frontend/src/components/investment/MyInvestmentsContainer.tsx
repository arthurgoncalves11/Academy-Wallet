import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import LoadingWrapper from "./SkeletonWrapper";
import { useInvestment } from "@/contexts/investmentContext";


const investmentUtils = {
  upperFirstLetter: (text: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "",

  formatCurrency: (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value),

  getRiskColor: (risk: string) => {
    const formatted = risk ? risk
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^(\w)/, (char: string) => char.toUpperCase()) : "";

    switch (formatted.toLowerCase()) {
      case "muito baixo":
        return "border-[#5895FF]";
      case "baixo":
        return "border-[#47A04B]";
      case "moderado":
        return "border-[#F67E07]";
      case "alto":
        return "border-red-500";
      case "muito alto":
        return "border-[#710D06]";
      default:
        return "border-gray-500";
    }
  },

  // Redemption value styling
  getRedemptionStyle: (redemption: number) =>
    redemption > 0
      ? "bg-[#E0F1E1] text-[#245026]"
      : "bg-[#E2E8F0] text-[#475569]",
};

// Interfaces
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

interface MyInvestmentsProps {
  setActiveTab: (tab: string) => void;
  selectedRisks: string[];
  nameFilter: string;
  investments: InvestmentData[];
}

const MyInvestmentsContainer: React.FC<MyInvestmentsProps> = ({
  setActiveTab,
  selectedRisks,
  nameFilter,
  investments,
}) => {
  const { setSelectedInvestment } = useInvestment();


  const filteredInvestments = useMemo(() => {
    return investments.flatMap((investment) => {
      console.log("investment.marketShares antes da conversão:", investment.marketShares);


      const marketShares: MarketShare[] = investment.marketShares
        ? Array.isArray(investment.marketShares)
          ? investment.marketShares
          : [investment.marketShares]
        : [];

      console.log("investment.marketShares depois da conversão:", marketShares);

      return marketShares.filter((marketShare) => {
        const matchesRisk =
          selectedRisks.length === 0 ||
          selectedRisks.some(
            (risk) => risk.toLowerCase() === marketShare.risk?.toLowerCase()
          );

        const matchesName =
          !nameFilter ||
          marketShare.name.toLowerCase().includes(nameFilter.toLowerCase());

        return matchesRisk && matchesName;
      });
    });
  }, [investments, selectedRisks, nameFilter]);

  const formattedRisk = (risk: string) => {
    return risk
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^(\w)/, (char: string) => char.toUpperCase());
  };


  const renderInvestmentCard = (marketShare: MarketShare, index: number) => (
    <section
      id="MyInvestment"
      onClick={() => setActiveTab(marketShare.name)}
      key={index}
      className={`
        bg-[#F8FAFC] 
        border-l-[6px] 
        ${investmentUtils.getRiskColor(marketShare.risk)
        } 
        rounded-lg w-full px-4 py-2 my-5 cursor-pointer
      `}
    >
      <header
        id="MyInvestmentCardHeader"
        className="flex items-center justify-evenly"
      >
        <div className="flex justify-between w-full my-2 mx-1">
          <LoadingWrapper
            loading={false}
            skeletonWidth="230px"
            skeletonHeight="25px"
          >
            <h1
              id="MyInvestmentName"
              className="font-semibold content-center text-[#475569]"
            >
              {marketShare.name}
            </h1>
          </LoadingWrapper>

          <LoadingWrapper
            loading={false} // Removido o estado de loading
            skeletonWidth="200px"
            skeletonHeight="33px"
          >
            <button
              id="MyInvestmentRedemptionValue"
              className={`
                ${investmentUtils.getRedemptionStyle(Number(marketShare.totalAvailableForRedemption))} 
                w-[auto] text-center mx-1 px-4 py-2 rounded-full font-semibold
              `}
              onClick={() => {
                setSelectedInvestment({ id: marketShare.id, isBought: true });
              }}

            >
              Resgate: {marketShare.totalAvailableForRedemption}
            </button>
          </LoadingWrapper>
        </div>

        <FontAwesomeIcon
          id="MyInvestmentChevronRight"
          icon={faChevronRight}
          className="text-[#94A3B8] w-[20px] h-[20px] p-1 cursor-pointer"
        />
      </header>

      <hr className="border-[#E2E8F0] mt-2" />

      <main
        id="MyInvestmentCardMain"
        className="grid lg:grid-cols-4 px-2 py-2 my-2 md:grid-cols-2"
      >
        {[
          {
            label: "Aplicação inicial mín.",
            value: investmentUtils.formatCurrency(Number(marketShare.minDeposit)),
          },
          {
            label: "Taxa fixa diária",
            value: `${marketShare.dayYield}%`,
          },
          {
            label: "Grau de risco",
            value: marketShare.risk ? formattedRisk(marketShare.risk) : " "
          },
          {
            label: "Total Investido",
            value: investmentUtils.formatCurrency(Number(marketShare.totalInvested)),
          },
        ].map(({ label, value }) => (
          <div
            id="MyInvestmentRedemptionDetailsData"
            key={label}
            className="my-2 w-[200px]"
          >
            <LoadingWrapper
              loading={false} // Removido o estado de loading
              skeletonWidth="160px"
              skeletonHeight="17px"
            >
              <h3 id="MyInvestmentTitle" className="text-[#64748B]">
                {label}
              </h3>
            </LoadingWrapper>
            <LoadingWrapper
              loading={false} // Removido o estado de loading
              skeletonWidth="100px"
              skeletonHeight="17px"
            >
              <p id="MyInvestmentData" className="text-[#475569] font-semibold">
                {value}
              </p>
            </LoadingWrapper>
          </div>
        ))}
      </main>
    </section>
  );

  return <div>{filteredInvestments.map(renderInvestmentCard)}</div>;
};

export default MyInvestmentsContainer;

