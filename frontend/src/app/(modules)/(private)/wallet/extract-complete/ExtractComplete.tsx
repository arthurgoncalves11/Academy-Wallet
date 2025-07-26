import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FilterDropdown } from "../../../../../components/ButtonFilter";
import VisibilityToggleButton from "../VisibilityToggleButton";
import { Transaction } from "../movement/models";
import ContainsMovements from "../movement/ContainsMovements";
import { fetchWithAuth, getTokenFromCookies } from "@/api-interceptor";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NoMovementsFilter from "./NoMovementsFilter";
import Cookies from 'js-cookie';


interface ExtractCompleteProps {
  isHidden: boolean;

  toggleVisibility: () => void;
}

const ExtractComplete: React.FC<ExtractCompleteProps> = ({
  isHidden,
  toggleVisibility,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);
  const period = ["7 dias", "15 dias", "30 dias", "60 dias", "90 dias"];
  const [listaDeMovimentacoes, setListaDeMovimentacoes] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true);
      try {
        const tokenData = getTokenFromCookies();
        if (!tokenData || !tokenData.idWallet) {
          throw new Error("idWallet não encontrado no token");
        }
        const { idWallet } = tokenData;
        const periodMapping: Record<string, string> = {
          Tudo: "all",
          "7 dias": "7",
          "15 dias": "15",
          "30 dias": "30",
          "60 dias": "60",
          "90 dias": "90",
        };

        const selectedPeriodValue =
          selectedPeriod.length === 0
            ? "all"
            : periodMapping[selectedPeriod[0]];
        const url =
          selectedPeriodValue === "all"
            ? `http://localhost:3000/transaction/all/${idWallet}`
            : `http://localhost:3000/transaction/filtro/${idWallet}/${selectedPeriodValue}`;
        const data = await fetchWithAuth(url);
        const transactionList = Array.isArray(data) ? data : data.data;
      
        setTimeout(() => {
          setListaDeMovimentacoes(transactionList);
        
          Cookies.set('movimentacoes', JSON.stringify(transactionList), { 
            expires: 900, 
            secure: true, 
            sameSite: 'Strict' 
          });
        
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error("Erro ao buscar movimentações filtradas:", error);
        setLoading(false);
      }
    };
  
    fetchMovements();
  }, [selectedPeriod]);

  const printExtract = () => {
    window.print();
  };

  return (
    <div className="flex flex-col mt-5 md:mr-[1px] lg:mr-[10px] ml-[20px] mb-8 h-full">
      <div className="header flex items-center justify-between mt-0 mb-2 ml-[15px] mr-[15px]">
        <div className="flex items-center mt-13">
          <Link
            id="back-to-wallet"
            href="/wallet"
            className="group text-titleLightGray flex items-center hover:text-titleFont md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[16px] transition-all duration-200 active:scale-90"
          >
            <Image
              src="/icon-left.svg"
              alt="icone de seta para a esquerda"
              className="text-[14px] xl:text-[18px] 2xl:text-[25px] text-iconRightArrow ml-[0px] md:mr-[2px] lg:mr-[5px] pr-[2px] xl:pr-[2px] 2xl:pr-[2px] group-hover:filter group-hover:brightness-50"
              width={16}
              height={16}
            />
            Carteira
          </Link>
          <h1
            className="font-semibold text-titleFont ml-2 md:mb-[2px]

          md:text-[13px] lg:text-[16px] xl:text-[20px] 2xl:text-[22px]"
          >
            / Extrato completo
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            id="button-export"
            className="flex items-center md:text-[0.8rem] lg:text-[0.9rem] bg-white h-[50px] md:h-[42px] lg:h-[55px] lg:w-[120px] sm:w-[85px] md:w-[90px]  px-4 border-[1px]

              rounded-md border-gray-300

              text-gray-500 transition-all duration-200 hover:bg-lightGray active:scale-90 sm:gap-0 md:gap-0 "
            onClick={() => printExtract()}
          >
            <Image
              src="/icon-export.svg"
              alt="icone de filtro"
              className="mr-2"
              width={20}
              height={20}
            />
            Exportar
          </Button>

          <FilterDropdown
            options={period}
            selectedOptions={selectedPeriod}
            setSelectedOptions={setSelectedPeriod}
            buttonText={selectedPeriod.length > 0 ? `Filtrar` : "Filtrar"}
          />
          <VisibilityToggleButton
            isHidden={isHidden}
            toggleVisibility={toggleVisibility}
            loading={loading}
          />
        </div>
      </div>

      <div className=" border-lightGray h-[1px]  bg-lightGray opacity-100 ml-[1%] mr-[1%]"></div>
      <h1 className="text-titleFont md:text-[16px]  lg:text-[16px] xl:text-[20px] 2xl:text-[24px] font-bold mt-3 ml-[15px]">
        Últimas movimentações
      </h1>

      {loading ? (
        <ContainsMovements
          listaDeMovimentacoes={[]}
          isHidden={isHidden}
          isExtractComplete={true}
          loading={true}
        />
      ) : listaDeMovimentacoes.length === 0 ? (
        <div className="flex justify-center items-center ">
          <NoMovementsFilter
            customMessage="Não há movimentações para o período selecionado"
            loading={false}
          />
        </div>
      ) : (
        <ContainsMovements
          listaDeMovimentacoes={listaDeMovimentacoes}
          isHidden={isHidden}
          isExtractComplete={true}
          loading={false}
        />
      )}
    </div>
  );
};

export default ExtractComplete;
