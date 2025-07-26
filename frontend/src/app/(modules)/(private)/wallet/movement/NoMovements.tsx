"use client";
import Image from "next/image";
import LoadingWrapper from "./LoadingWrapper";

interface NoMovementsProps {
  customMessage?: string;
  loading: boolean;
}

const NoMovements: React.FC<NoMovementsProps> = ({ customMessage, loading }) => {
  return (
    <div className="flex justify-center items-center flex-col min-h-[52vh] lg:w-[500px] md:w-[370px] gap-4 mt-[60px]">
      
      <LoadingWrapper
        loading={loading}
        skeletonWidth="170px"
        skeletonHeight="170px"
      >
        <Image
          src="/Empty-State.png"
          alt="Nenhuma movimentação"
          width={500} 
          height={500}
          className="md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] xl:w-[220px] xl:h-[220px] min-w-[150px] max-w-[500px] mx-auto" 
          priority
        />
      </LoadingWrapper>

      <LoadingWrapper
        loading={loading}
        skeletonWidth="400px"
        skeletonHeight="35px"
      >
        <p className="font-normal text-sm leading-[0px] text-titleFont md:text-[14px] lg:text-[18px]  xl:text-[20px] 2xl:text-[22px] text-center">
          {customMessage || "Você ainda não tem movimentações na sua conta"}
        </p>
      </LoadingWrapper>
    </div>
  );
};

export default NoMovements;
