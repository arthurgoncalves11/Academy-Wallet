import React from "react";
import Image from "next/image";

export default function EmptyPageRefundRedemption() {
  return (
    <>
      <div className="flex flex-col items-center justify-self-center m-14">
        <Image
          src="/EmptyStateEmailZero.svg"
          alt="Um homem com barba e cabelos escuros, usando uma jaqueta branca, abrindo uma caixa de correio e encontrando-a vazia."
          width={400}
          height={400}
          className="md:h-full mb-2"
        />

        <p className="text-center text-lg font-semibold w-[500px] h-[17px]">
          Você não tem nenhum investimento nesse fundo
        </p>
      </div>
    </>
  );
}
