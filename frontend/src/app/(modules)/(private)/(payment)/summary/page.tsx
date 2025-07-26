"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBankSlip, useUser } from "@/contexts/paymentContext";
import { useEffect } from "react";
import SectionTitle from "@/components/payment/summary/SummarySectionTitle";
import Divider from "@/components/payment/summary/Divider";
import InfoBlock from "@/components/payment/summary/InfoBlock";
import SmallerInfoBlock from "@/components/payment/summary/SmallerInfoBlock";
import StepIndicator from "@/components/payment/StepIndicator";
import { CPFStaticFormater } from "@/utils/cpfMask";
import formatStaticValue from "@/utils/valueMask";
import { PinInputDialog } from "@/components/PasswordDialog";
import PaymentData from "@/components/payment/PaymentData";

export default function Summary() {
  const router = useRouter();
  const { bankSlip } = useBankSlip();
  const { user } = useUser();

  useEffect(() => {
    if (Object.keys(bankSlip).length === 0 && Object.keys(user).length === 0) {
      router.push("/payment");
    }
  }, [bankSlip, user, router]);

  return (
    <PaymentData>
      {({ handleConfirmPayment }) => (
        <div
          id="payment-section"
          className="flex flex-col bg-[#FFFFFF] border border-[#F1F5F9] rounded-[0.5rem] md:mb-[0.844rem] mb-[1.125rem] lg:mb-[1.125rem] h-full"
        >
          <div className="flex items-center justify-between md:pt-[1.078rem] md:px-[1.125rem] md:h-[2rem] lg:pt-[1.438rem] lg:px-[1.5rem] lg:h-[2.5rem]">
            <h1
              title="Pagamentos"
              id="page-title"
              className="text-[#1E293B] font-semibold"
            >
              Pagamentos
            </h1>
            <StepIndicator pageNumber={3} />
          </div>
          <div
            id="line-1"
            className="border-t border-[#E2E8F0] md:mb-[1.125rem] md:mt-[1.031rem] md:mx-[0.563rem] lg:mb-[1.5rem] lg:mt-[1.375rem] lg:mx-[0.75rem]"
          ></div>
          <SectionTitle
            title1="Resumo do pagamento"
            title2="Dados do beneficiário"
          />
          <Divider />
          <div id="section-1" className="w-full">
            <div
              id="sub-section-1"
              className="flex w-full md:mb-[1.125rem] lg:mb-[1.5rem]"
            >
              <div className="w-1/2 md:pl-[1.125rem] lg:pl-[1.5rem]">
                <p
                  title="Linha digitável do código de barras"
                  id="bar-code-label"
                  className="text-[#64748B] font-medium"
                >
                  Linha digitável do código de barras
                </p>
                <p
                  id="bar-code-value"
                  title={bankSlip.typeableLine === "" ? "-" : bankSlip.typeableLine}
                  className="text-[#00253F] md:max-w-[17rem] font-medium md:break-words lg:break-words xl:whitespace-nowrap"
                >
                  {bankSlip.typeableLine === "" ? "-" : bankSlip.typeableLine}
                </p>
              </div>
              <InfoBlock
                label="Nome fantasia"
                value={bankSlip.nameFantasy === "" ? "-" : bankSlip.nameFantasy}
              />
            </div>
            <div
              id="sub-section-2"
              className="flex w-full md:mb-[1.125rem] lg:mb-[1.5rem]"
            >
              <InfoBlock
                label="Instituição emissora"
                value={bankSlip.institution === "" ? "-" : bankSlip.institution}
              />
              <InfoBlock
                label="Razão social"
                value={bankSlip.legalName === "" ? "-" : bankSlip.legalName}
              />
            </div>
            <div
              id="sub-section-3"
              className="flex w-full md:mb-[2.625rem] lg:mb-[3.5rem]"
            >
              <div className="w-1/2 md:pl-[1.125rem] lg:pl-[1.5rem]"></div>
              <InfoBlock
                label="CPF/CNPJ"
                value={bankSlip.cpfOrCnpj === "" ? "-" : bankSlip.cpfOrCnpj}
              />
            </div>
          </div>
          <SectionTitle
            title1="Dados do pagamento"
            title2="Dados do pagador final"
          />
          <Divider />
          <div id="section-2" className="w-full">
            <div
              id="sub-section-1"
              className="flex w-full md:mb-[1.125rem] lg:mb-[1.5rem]"
            >
              <InfoBlock label="Nome" value={user.name} />
              <InfoBlock
                label="Banco recebedor"
                value={bankSlip.nameBank === "" ? "-" : bankSlip.nameBank}
              />
            </div>
            <div
              id="sub-section-2"
              className="flex w-full md:mb-[1.125rem] lg:mb-[1.5rem]"
            >
              <InfoBlock label="CPF/CNPJ" value={CPFStaticFormater(user.cpf)} />
              <InfoBlock
                label="Agência"
                value={bankSlip.agency === "" ? "-" : bankSlip.agency}
              />
            </div>
            <div
              id="sub-section-3"
              className="flex w-full md:mb-[2.625rem] lg:mb-[3.5rem]"
            >
              <div className="w-1/2 md:pl-[1.125rem] lg:pl-[1.5rem]"></div>
              <InfoBlock
                label="Conta"
                value={bankSlip.account === "" ? "-" : bankSlip.account}
              />
            </div>
          </div>
          <SectionTitle title1="Valores" />
          <Divider />
          <div id="section-3" className="w-full">
            <SmallerInfoBlock
              label1="Valor nominal"
              value1={formatStaticValue(bankSlip.nominalValue)}
              label2="Juros"
              value2={
                bankSlip.fees === undefined ? "" : "R$ " + bankSlip.fees + ",00"
              }
              label3="Multa"
              value3={
                bankSlip.penalty === undefined
                  ? ""
                  : "R$ " + bankSlip.penalty + ",00"
              }
              label4="Valor a pagar"
              value4={formatStaticValue(bankSlip.nominalValue)}
            />
            <SmallerInfoBlock
              label1="Juros"
              value1={
                bankSlip.fees === undefined ? "" : "R$ " + bankSlip.fees + ",00"
              }
              label2="Vencimento"
              value2={
                bankSlip.dateForExpirate === "" ? "-" : bankSlip.dateForExpirate
              }
              label3="Pagamento"
              value3={bankSlip.dateToPay === "" ? "-" : bankSlip.dateToPay}
              label4="Operação"
              value4={
                bankSlip.dateToOperation === "" ? "-" : bankSlip.dateToOperation
              }
            />
          </div>
          <div
            id="buttons-section"
            className="md:mt-[0.375rem] lg:mt-[0.5rem] self-end"
          >
            <Button
              id="go-back-button"
              title="Voltar"
              className="text-[#0F172A] border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] md:mr-[0.563rem] lg:mr-[0.75rem]"
              onClick={() => router.push("/checking")}
            >
              Voltar
            </Button>
            <PinInputDialog
              onConfirmPayment={handleConfirmPayment}
              confirmButtonText="Confirmar pagamento"
              barcode={bankSlip.barcode}
              name={user.name}
              value={bankSlip.valueToPay}
              triggerButton={
                <Button
                  className="bg-[#00253F] hover:bg-[#00225C] text-[#FFFFFF] hover:text-white md:mr-[1.125rem] lg:mr-[1.5rem]"
                  variant="outline"
                  title="Realizar pagamento"
                >
                  Realizar pagamento
                </Button>
              }
            />
          </div>
        </div>
      )}
    </PaymentData>
  );
}
