"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import LoadingWrapper from "@/components/payment/checking/SkeletonWrapper";
import Image from "next/image";
import { useBankSlip, useUser } from "@/contexts/paymentContext";
import { useEffect, useState } from "react";
import StepIndicator from "@/components/payment/StepIndicator";
import WarningArea from "@/components/payment/WarningArea";
import InfoField from "@/components/payment/checking/InfoField";
import { CPFStaticFormater } from "@/utils/cpfMask";
import formatStaticValue from "@/utils/valueMask";

export default function Checking() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { bankSlip } = useBankSlip();
  const { user } = useUser();

  useEffect(() => {
    if ((Object.keys(bankSlip).length === 0) && (Object.keys(user).length === 0)) {
      router.push("/payment");
    }
    setLoading(false)
  }, [bankSlip, user, router]);

  return (
    <>
      <div
        id="payment-upper-section"
        className="flex flex-col bg-[#FFFFFF] border border-[#F1F5F9] rounded-[0.5rem] md:mb-[0.844rem] md:h-[14.625rem] mb-[1.125rem] h-[16.5rem] lg:mb-[1.125rem] lg:h-[17rem]"
      >
        <div className="flex items-center justify-between md:pt-[1.078rem] md:px-[1.125rem] md:h-[2rem] lg:pt-[1.438rem] lg:px-[1.5rem] lg:h-[2.5rem]">
          <h1 id="page-title" title="Pagamentos" className="text-[#1E293B] font-semibold">
            Pagamentos
          </h1>
          <StepIndicator pageNumber={2} />
        </div>
        <div
          id="line"
          className="border-t border-[#E2E8F0] md:mb-[1.125rem] md:mt-[1.031rem] md:mx-[0.563rem] lg:mb-[1.5rem] lg:mt-[1.375rem] lg:mx-[0.75rem]"
        ></div>
        <div className="flex justify-between w-full md:gap-[1.5rem] lg:gap-[2rem] md:px-[1.125rem] px-[1.5rem] lg:px-[1.5rem]">
          <div id="bar-code-area" className="lg:max-w-full flex-grow">
            <h1 title="Código de barras" className="md:pb-[0.281rem] pb-[0.375rem] lg:pb-[0.375rem] font-medium text-[#00253F]">
              Código de barras
            </h1>
            <div className="relative">
              <LoadingWrapper
                loading={loading}
                mdSkeletonWidth="md:max-w-full"
                mdSkeletonHeight="md:h-[2.5rem]"
                skeletonWidth="lg:max-w-full"
                skeletonHeight="lg:h=[2.5rem]"
              >
                <Input
                  id="bar-code-input"
                  className="border-[#CBD5E1] text-[#94A3B8]"
                  title={bankSlip.typeableLine === "" ? "-" : bankSlip.typeableLine}
                  defaultValue={
                    bankSlip.typeableLine === "" ? "-" : bankSlip.typeableLine
                  }
                  readOnly
                ></Input>
              </LoadingWrapper>
              <Image
                className="right-[0.625rem] absolute top-1/2 -translate-y-1/2 "
                src="/bar-code-icon.svg"
                alt="bar code"
                width="20"
                height="20"
              ></Image>
            </div>
          </div>
          <WarningArea />
        </div>
      </div>
      <div
        id="payment-bottom-section"
        className="flex flex-col bg-[#FFFFFF] border border-[#F1F5F9] rounded-[0.5rem]"
      >
        <div
          id="title-section-1"
          className="flex border-b border-[#E2E8F0] md:pb-[0.75rem] md:pt-[1.125rem] md:mx-[0.563rem] pb-[1rem] pt-[1.5rem] mx-[0.75rem] lg:pb-[1rem] lg:pt-[1.5rem] lg:mx-[0.75rem]"
        >
          <h1 title="Dados do beneficiário" className="w-1/2 text-[#334155] font-normal md:pl-[0.563rem] pl-[0.75rem] lg:pl-[0.75rem]">
            Dados do beneficiário
          </h1>
          <h1 title="Dados do pagador" className="w-1/2 text-[#334155] font-normal md:pl-[0.563rem] pl-[0.75rem] lg:pl-[0.75rem]">
            Dados do pagador
          </h1>
        </div>
        <div
          id="section-1"
          className="flex md:pt-[1.125rem] md:mx-[0.563rem] pt-[1.5rem] mx-[0.75rem] lg:pt-[1.5rem] lg:mx-[0.75rem]"
        >
          <InfoField
            label1={"Nome fantasia"}
            value1={bankSlip.nameFantasy === "" ? "-" : bankSlip.nameFantasy}
            label2={"CPF/CNPJ do beneficiário"}
            value2={bankSlip.cpfOrCnpj === "" ? "-" : bankSlip.cpfOrCnpj}
            loading={loading}
            contentFlag={2}
          />
          <InfoField
            label1={"Nome fantasia"}
            value1={user.name}
            label2={"CPF/CNPJ do pagador"}
            value2={CPFStaticFormater(user.cpf)}
            loading={loading}
            contentFlag={2}
          />
        </div>
        <div
          id="title-section-2"
          className="fxlex border-b border-[#E2E8F0] md:pb-[0.75rem] md:pt-[1.5rem] md:mx-[0.563rem] pb-[1rem] pt-[2rem] mx-[0.75rem] lg:pb-[1rem] lg:pt-[2rem] lg:mx-[0.75rem]"
        >
          <h1 title="Dados do pagamento" className="w-1/2 text-[#334155] font-normal md:pl-[0.563rem] pl-[0.75rem] lg:pl-[0.75rem]">
            Dados do pagamento
          </h1>
        </div>
        <div
          id="section-2"
          className="flex md:pt-[1.125rem] md:mx-[0.563rem] pt-[1.5rem] mx-[0.75rem] lg:pt-[1.5rem] lg:mx-[0.75rem]"
        >
          <InfoField
            label1={"Valor nominal"}
            value1={formatStaticValue(bankSlip.nominalValue)}
            label2={"Desconto"}
            value2={bankSlip.discount === undefined ? "" : "R$ " + bankSlip.discount + ",00"}
            label3={"Multa"}
            value3={bankSlip.penalty === undefined ? "" : "R$ " + bankSlip.penalty + ",00"}
            contentFlag={3}
            loading={loading}
          />
          <InfoField
            label1={"Juros"}
            value1={bankSlip.fees === undefined ? "" : "R$ " + bankSlip.fees + ",00"}
            label2={"Valor a pagar"}
            value2={formatStaticValue(bankSlip.valueToPay)}
            label3={"Vencimento"}
            value3={bankSlip.dateForExpirate === "" ? "-" : bankSlip.dateForExpirate}
            contentFlag={3}
            loading={loading}
          />
        </div>
        <div
          id="title-section-3"
          className="fxlex border-b border-[#E2E8F0] md:pb-[0.75rem] md:pt-[1.5rem] md:mx-[0.563rem] pb-[1rem] pt-[2rem] mx-[0.75rem] lg:pb-[1rem] lg:pt-[2rem] lg:mx-[0.75rem]"
        >
          <h1 title="Para quando?" className="w-1/2 text-[#334155] font-normal md:pl-[0.563rem] pl-[0.75rem] lg:pl-[0.75rem]">
            Para quando?
          </h1>
        </div>
        <div
          id="section-3"
          className="flex items-center md:pt-[1.125rem] pt-[1.5rem] lg:pt-[1.5rem] md:pl-[1.125rem] pl-[1.5rem] lg:pl-[1.5rem]"
        >
          <Input
            id="paying-today"
            type="radio"
            className="border-[#00253F] accent-[#00253F] md:w-[0.75rem] md:h-[0.75rem] w-[1rem] h-[1rem] lg:w-[1rem] lg:h-[1rem] hover:cursor-pointer"
            defaultChecked
          ></Input>
          <p title="Hoje ou próximo dia útil" className="text-[#00253F] font-medium md:pl-[0.375rem] pl-[0.5rem] lg:pl-[0.5rem]">
            Hoje ou próximo dia útil
          </p>
        </div>
        <div
          id="buttons-section"
          className="md:mt-[3.375rem] mt-[4.5rem] lg:mt-[4.5rem] self-end"
        >
          <Button
            id="go-back-button"
            title="Voltar"
            className="text-[#0F172A] border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] md:mb-[1.125rem] md:mr-[0.563rem] mb-[1.5rem] mr-[0.75rem] lg:mb-[1.5rem] lg:mr-[0.75rem]"
            onClick={() => router.push("/payment")}
          >
            Voltar
          </Button>
          <Button
            id="continue-button"
            title="Continuar"
            className="bg-[#00253F] hover:bg-[#00225C] md:mb-[1.125rem] md:mr-[1.125rem] mb-[1.5rem] mr-[1.5rem] lg:mb-[1.5rem] lg:mr-[1.5rem]"
            onClick={() => router.push("/summary")}
          >
            Continuar
          </Button>
        </div>
      </div>
    </>
  );
}
