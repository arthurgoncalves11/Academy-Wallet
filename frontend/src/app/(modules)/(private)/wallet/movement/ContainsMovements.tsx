import React, { useState } from "react";
import { Transaction } from "./models";
import LoadingWrapper from "./LoadingWrapper";
import ItemMovement from "./ItemMovement";
import { useRouter } from "next/navigation";

interface ContainsMovimentsProps {
  listaDeMovimentacoes: Transaction[];
  isHidden: boolean;
  isExtractComplete?: boolean;
  loading: boolean;
}

export const formatarData = (data: string): string => {
  const [year, month, day] = data.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const currentYear = new Date().getFullYear();

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    ...(year !== currentYear && { year: "numeric" }),
  };

  return new Intl.DateTimeFormat("pt-BR", options).format(date);
};

const ContainsMoviments: React.FC<ContainsMovimentsProps> = ({
  listaDeMovimentacoes,
  isHidden,
  isExtractComplete = false,
  loading,
}) => {
  const [visibleMovements, setVisibleMovements] = useState(
    isExtractComplete ? 14 : 5
  );
  const router = useRouter();

  const listaSegura = Array.isArray(listaDeMovimentacoes) ? listaDeMovimentacoes : [];

  const movimentosVisiveis = listaSegura.slice(0, visibleMovements);
  const totalMovimentacoesDisponiveis = listaSegura.length;

  let continuousIndex = 0;

  const groupedByDate = movimentosVisiveis.reduce<
    Record<string, Transaction[]>
  >((acc, movimentacao) => {
    const dateObj = new Date(movimentacao.tcs_dt_date);
    if (isNaN(dateObj.getTime())) {
      console.error("Data inválida:", movimentacao.tcs_dt_date);
      return acc;
    }
    const date = dateObj.toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(movimentacao);
    return acc;
  }, {});

  const groupedDates = Object.keys(groupedByDate);

  const handleLoadMore = () => {
    setVisibleMovements((prev) => prev + 14);
  };

  const isLoading = loading && groupedDates.length === 0;

  return (
    <div className="lg:ml-[12px] sm:ml-[8px] md:ml-[10px] mt-[0px]">
      {isLoading ? (
        <div className="text-titleFont mt-[10px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px]">
          Carregando transações, isso pode levar alguns instantes...
        </div>
      ) : groupedDates.length > 0 ? (
        groupedDates.map((date, index) => {
          const formattedDate = formatarData(date);

          return (
            <div key={`date-group-${index}-${date}`}>
              <LoadingWrapper
                loading={loading}
                skeletonWidth="95px"
                skeletonHeight="22px"
              >
                <div className="data flex p-2 items-center justify-center bg-dataBackground w-fit lg:h-[27px] sm:h-[20px] md:h-[20px] rounded-[50px] border-[1px] border-lightGray md:mt-[30px] lg:mt-[30px] xl:mt-[35px] 2xl:mt-[35px]">
                  <p className="text-titleFont sm:text-[12px] md:text-[9px] lg:text-[11px] xl:text-[12px] 2xl:text-[12px] font-semibold leading-[14.52px]">
                    {formattedDate}
                  </p>
                </div>
              </LoadingWrapper>

              <div className="movimentacoes ">
                {loading
                  ? 
                    Array.from({ length: groupedByDate[date].length }).map(
                      (_, idx) => (
                        <LoadingWrapper
                          key={`loading-item-${idx}`}
                          loading={loading}
                          skeletonWidth="100%"
                          skeletonHeight="60px"
                        >
                          <div className="item-placeholder"></div>
                        </LoadingWrapper>
                      )
                    )
                  : groupedByDate[date].map((movimentacao, idx) => {
                      const currentIndex = ++continuousIndex;

                      return (
                        <ItemMovement
                          key={`movement-${currentIndex}`}
                          transaction={movimentacao}
                          isLast={idx === groupedByDate[date].length - 1}
                          index={currentIndex}
                          isHidden={isHidden}
                          loading={loading}
                        />
                      );
                    })}
              </div>
            </div>
          );
        })
      ) : (
        <div>Sem movimentações para exibir.</div>
      )}

      {listaSegura.length > 5 && !isExtractComplete && (
        <div className="flex justify-center items-center px-4 sm:mt-[35px] md:mt-[40px] lg:mt-[65px] xl:mt-[50px] 2xl:mt-[0px] mb-[15px] ">
          <LoadingWrapper
            loading={loading}
            skeletonWidth="145px"
            skeletonHeight="35px"
          >
            <button
              onClick={() => router.push("/wallet/extract-complete")}
              id="see-full-extract"
              className="font-inter font-medium text-[14px] md:text-sm leading-[24px] bg-white text-textButton py-2 px-4 rounded-lg 
                hover:bg-lightGray active:bg-gray-200 transition-all duration-200 active:scale-90 border border-borderButton"
            >
              Ver extrato completo
            </button>
          </LoadingWrapper>
        </div>
      )}

      {isExtractComplete &&
        totalMovimentacoesDisponiveis > visibleMovements && (
          <div className="flex justify-center items-center px-4 sm:mt-[35px] md:mt-[40px] lg:mt-[65px] xl:mt-[50px] 2xl:mt-[0px] mb-[15px]">
            <LoadingWrapper
              loading={loading}
              skeletonWidth="145px"
              skeletonHeight="35px"
            >
              <button
                onClick={handleLoadMore}
                id="load-more"
                className="font-inter font-medium md:text-sm text-14px leading-[24px] bg-white text-textButton py-2 px-4 rounded-lg hover:bg-lightGray active:bg-gray-200 transition-all duration-200 active:scale-90 border border-borderButton no-printme"
              >
                Carregar mais
              </button>
            </LoadingWrapper>
          </div>
        )}
    </div>
  );
};

export default ContainsMoviments;
