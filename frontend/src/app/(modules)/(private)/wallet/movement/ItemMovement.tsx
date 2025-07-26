"use client";
import Image from "next/image";
import { Transaction } from "./models";
import LoadingWrapper from "./LoadingWrapper";

const ItemMovement: React.FC<{
  transaction: Transaction;
  isLast: boolean;
  index: number;
  isHidden: boolean;
  loading: boolean;
}> = ({ transaction, isLast, index, isHidden, loading }) => {
  const generateIdTitle = () => `title-${index}`;
  const generateIdName = () => `name-${index}`;
  const generateIdValue = () => `value-${index}`;

  const formatarTitulo = (
    tcs_st_type: string,
    tcs_st_name: string,
    tcs_st_description: string
  ) => {
    let iconSrc = "";
    let titulo = "";
    let bgColor = "";
    let name = "";

    if (
      tcs_st_type.toUpperCase() === "CREDIT" &&
      !tcs_st_description.toLowerCase().startsWith("resgate")
    ) {
      iconSrc = "/icon-money.svg";
      titulo = "Depósito em conta";
      bgColor = "bg-moneyEntryBackground";
      name = tcs_st_name;
    } else if (
      tcs_st_type.toUpperCase() === "DEBIT" &&
      !tcs_st_description.toLowerCase().startsWith("investimento")
    ) {
      iconSrc = "/icon-bill.svg";
      titulo = "Boleto pago";
      bgColor = "bg-dataBackground";
      name = tcs_st_name;
    } else if (
      tcs_st_type.toUpperCase() === "DEBIT" &&
      tcs_st_description.toLowerCase().startsWith("investimento")
    ) {
      iconSrc = "/icon-investments.svg";
      titulo = "Investimento realizado";
      bgColor = "bg-dataBackground";
    } else if (
      tcs_st_type.toUpperCase() === "CREDIT" &&
      tcs_st_description.toLowerCase().startsWith("resgate")
    ) {
      iconSrc = "/icon-investments-green.svg";
      titulo = "Resgate de investimento";
      bgColor = "bg-moneyEntryBackground";
    } else {
      titulo = "Movimentação";
      iconSrc = "/icon-investments.svg";
      bgColor = "bg-defaultBackground";
    }

    return { iconSrc, titulo, bgColor, name };
  };

  const { iconSrc, titulo, bgColor, name } = formatarTitulo(
    transaction.tcs_st_type,
    transaction.tcs_st_name,
    transaction.tcs_st_description
  );

  const formatarValor = (
    transaction: Transaction,
    isHidden: boolean
  ): string => {
    if (isHidden) return "••••••";
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(transaction.tcs_db_value);

    return transaction.tcs_st_name !== "Investimento" &&
      transaction.tcs_st_type === "DEBIT"
      ? `- ${valorFormatado}`
      : valorFormatado;
  };
  const valorFormatado = formatarValor(transaction, isHidden);

  return (
    <div>
      <div className="flex items-center ml-[10px] sm:h-[20vh] md:h-[40px] lg:h-[4vh] xl:h-[4vh] 2xl:h-[4vh] justify-between lg:mb-[18px] mb-[1%] sm:mt-[10px] md:mt-[10px] lg:mt-[20px] avoid-break">
        <div className="infos-esquerda flex items-center gap-2">
          <LoadingWrapper
            loading={loading}
            skeletonWidth="37px"
            skeletonHeight="37px"
          >
            <div
              className={`img sm:w-[30px] md:w-[30px] lg:w-[40px] xl:w-[40px] 2xl:w-[40px] 
                            md:h-[35px] lg:h-[40px] xl:h-[40px] 2xl:h-[40px] 
                            rounded-[6px] flex items-center justify-center ${bgColor}`}
            >
              <Image
                src={iconSrc}
                alt={transaction.tcs_st_type}
                width={50}
                height={50}
                className={`object-contain 
                    ${
                      iconSrc === "/icon-investments.svg"
                        ? "sm:w-[32px] sm:h-[32px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px] xl:w-[26px] xl:h-[26px] 2xl:w-[26px] 2xl:h-[26px]"
                        : "sm:w-[28px] sm:h-[28px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px] xl:w-[20px] xl:h-[20px] 2xl:w-[20px] 2xl:h-[20px]"
                    }`}
              />
            </div>
          </LoadingWrapper>

          <div className="titulo-nome flex flex-col self-center gap-0.5">
            <LoadingWrapper
              loading={loading}
              skeletonWidth="130px"
              skeletonHeight="22px"
            >
              <p
                id={generateIdTitle()}
                className="font-inter xl:text-[15px] lg:text-[14px] md:text-[12px] font-semibold leading-[16.94px] text-left text-titleFont"
              >
                {titulo}
              </p>
            </LoadingWrapper>
            <LoadingWrapper
              loading={loading}
              skeletonWidth="130px"
              skeletonHeight="22px"
            >
              <p
                id={generateIdName()}
                className="id der nome font-inter xl:text-[14px] lg:text-[14px] md:text-[10px]font-normal leading-[16.94px] text-left underline-from-font decoration-skip-ink-none"
              >
                {name}
              </p>
            </LoadingWrapper>
          </div>
        </div>

        <div className="infos-direita">
          <LoadingWrapper
            loading={loading}
            skeletonWidth="115px"
            skeletonHeight="32px"
            className="xl:mr-[32px] md:mr-[20px]"
          >
            <p
              id={generateIdValue()}
              className="font-inter md:text-[12px] font-normal leading-[19.36px] lg:text-[16px] mr-[5px]"
            >
              <strong>R$ </strong> {valorFormatado}
            </p>
          </LoadingWrapper>
        </div>
      </div>

      {!isLast && (
        <div className="border-lightGray w-[99%] border-[1px] lg:max-mt-[18px]"></div>
      )}
    </div>
  );
};

export default ItemMovement;
