import React from "react";
import LoadingWrapper from "./SkeletonWrapper";
import RefundSection from "./RefundSection";

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
  totalInvested: number;
  totalAvailableForRedemption: number;
}


// Interface para as props do componente
interface RefundRedemptionContainerProps {
  investmentData: InvestmentData; // Dados do investimento passados pelo pai
}

// Cores de borda com base no risco
const RISK_BORDER_COLORS: Record<string, string> = {
  "muito baixo": "border-[#5895FF]",
  baixo: "border-[#47A04B]",
  moderado: "border-[#F67E07]",
  alto: "border-red-500",
  "muito alto": "border-[#710D06]",
  default: "border-gray-500",
};

const formattedRisk = (risk: string) => {
  return risk
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^(\w)/, (char: string) => char.toUpperCase());
};

const RefundRedemptionContainer: React.FC<RefundRedemptionContainerProps> = ({
  investmentData,
}) => {

  const formatters = {
    currency: (value: string | number) => {
      const stringValue = typeof value === 'number' ? value.toString() : value;
      const numberValue = parseFloat(stringValue.replace(',', '.'));

      if (isNaN(numberValue)) {
        throw new Error("Valor inválido");
      }

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numberValue);
    },


    currencyNum: (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", }).format(value),

    date: (date: string) => new Date(date).toLocaleDateString("pt-BR"),

    cnpj: (cnpj: string) =>
      cnpj
        ? cnpj
          .replace(/\D/g, "")
          .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
        : "",

    upperFirstLetter: (text: string) =>
      text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "",
  };


  const getRiskBorderColor = (risk: string) =>
    RISK_BORDER_COLORS[risk.toLowerCase()] || RISK_BORDER_COLORS.default;

  console.log("investiemnstos refund redemption", investmentData.totalInvested, typeof investmentData.totalInvested)

  return (
    <div>
      <div
        className={`
          bg-[#F8FAFC] 
          border-l-[6px] 
          ${getRiskBorderColor(investmentData.risk)} 
          rounded-lg 
          w-fill 
          px-4 
          mt-6 
          mx-6
        `}
      >
        <header className="flex items-center justify-evenly">
          <div className="flex justify-between w-full m-2 py-2">
            <h1
              id="RefundRedemptionHeader"
              className="font-semibold content-center text-[#475569]"
            >
              {investmentData.name}
            </h1>
          </div>
        </header>

        <hr className="border-[#E2E8F0]" />

        {/* Informações principais do investimento */}
        <main className="grid lg:grid-cols-4 p-2 my-2 md:grid-cols-2">
          {[
            {
              label: "Aplicação inicial mín.",
              value: formatters.currency(investmentData.minDeposit),
            },
            { label: "Taxa fixa diária", value: `${investmentData.dayYield}%` },
            {
              label: "Grau de risco",
              value: formattedRisk(investmentData.risk),
            },
            {
              label: "Total Investido",
              value: formatters.currency(investmentData.totalInvested),
            },
          ].map(({ label, value }) => (
            <div key={label} className="my-2 w-auto">
              <h3 id="RefundRedemptionMainTitle" className="text-[#64748B]">
                {label}
              </h3>
              <p
                id="RefundRedemptionMainData"
                className="text-[#475569] font-semibold"
              >
                {value}
              </p>
            </div>
          ))}
        </main>
      </div>

      {/* Seção de resgate */}
      <RefundSection
        title="Total para resgate"
        subtitle="Importante"
        paragraphs={[
          `Total investido: ${formatters.currencyNum(investmentData.totalInvested)}`,
        ]}
        isRescue={true}
        textValueColor={"placeholder:text-[#47A04B] text-[#47A04B]"}
        minDeposit={investmentData.minDeposit}
        initialValue={investmentData.totalAvailableForRedemption}
        marketShareId={investmentData.id}
        totalRedemption={investmentData.totalAvailableForRedemption}
      />

      {/* Seção de informações detalhadas */}
      <div className="bg-[#F8FAFC] rounded-lg w-fill px-4 py-2 m-6">
        <div className="text-[#475569] font-semibold flex justify-between w-full ml-2 py-2">
          Detalhes do fundo
        </div>

        <hr className="border-[#E2E8F0]" />

        {/* Grid de informações detalhadas */}
        <footer
          id="RefundRedemptionDetailsData"
          className="grid lg:grid-cols-4 gap-4 md:grid-cols-2 justify-between w-full m-2 py-2"
        >
          {[
            { label: "CNPJ", value: formatters.cnpj(investmentData.cnpj) },
            { label: "Gestor", value: investmentData.manager },
            { label: "Custodiante", value: investmentData.shareKeeper },
            {
              label: "Data de início",
              value: formatters.date(investmentData.createdAt),
            },
            { label: "Benchmark", value: investmentData.benchmark },
            { label: "Cotização da aplicação", value: "D+0" },
            { label: "Cotização de resgate", value: "D+0" },
            { label: "Taxa de performance", value: "Não há" },
            {
              label: "Rentabilidade (ano)",
              value: `${investmentData.yearYield}%`,
            },
            {
              label: "Dias para resgate",
              value: `D+${investmentData.daysToRetrieve}`,
            },
            {
              label: "Patrimônio líquido",
              value: formatters.currencyNum(investmentData.marketValue),
            },
            {
              label: "Patrimônio líquido médio 12 meses",
              value: formatters.currencyNum(investmentData.marketValueYearAvg),
            },
          ].map(({ label, value }) => (
            <div key={label} className="my-2 w-auto">
              <h3 id="RefundRedemptionTitle" className="text-[#64748B]">
                {label}
              </h3>
              <p
                id="RefundRedemptionData"
                className="text-[#475569] font-semibold"
              >
                {value}
              </p>
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
};

export default RefundRedemptionContainer;