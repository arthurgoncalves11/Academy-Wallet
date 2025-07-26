import React from "react";
import Image from "next/image"

interface MyInvestmentsProps {
  setActiveTab: (tab: "investment" | "myInvestment") => void;
}

export function EmptyPageMyInvestments({ setActiveTab }: MyInvestmentsProps) {
  return (
    <div className="flex justify-center items-center h-[24rem]">
      <div className="flex items-center flex-col">
        <Image
          src="/myInvestiments-EmptyState.svg"
          width={256}
          height={256}
          alt="Menina plantando"

        />
        <h1 className="text-lg">Cultive seu futuro, comece a investir agora</h1>
        <button
          className="rounded-[6px] border-[1px] w-[158px] h-[40px] mt-10"
          onClick={() => setActiveTab("investment")}
        >
          Começar a investir
        </button>
      </div>
    </div>
  );
}
