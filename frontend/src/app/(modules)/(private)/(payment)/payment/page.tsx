// paymentPage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Notification } from "@/components/Notification";
import PaymentData from "@/components/payment/PaymentData";
import StepIndicator from "@/components/payment/StepIndicator";
import WarningArea from "@/components/payment/WarningArea";
import { usePaymentResult } from "@/contexts/paymentContext";

export default function Payment() {
  const { paymentResult, setPaymentResult } = usePaymentResult();

  return (
    <PaymentData>
      {({
        inputValue,
        handleInputChange,
        handleSubmit,
        showNotificationError,
        notificationMessage,
        setShowNotificationError,
        isButtonDisabled,
        setNotificationMessage,
      }) => (
        <div
          id="payment"
          className="h-full flex flex-col bg-[#FFFFFF] border border-[#F1F5F9] rounded-[0.5rem]"
        >
          <div className="flex items-center justify-between md:pt-[1.078rem] md:px-[1.125rem] md:h-[2rem] lg:pt-[1.438rem] lg:px-[1.5rem] lg:h-[2.5rem]">
            <h1
              title="Pagamentos"
              id="page-title"
              className="text-[#1E293B] font-semibold"
            >
              Pagamentos
            </h1>
            <StepIndicator pageNumber={1} />
            {showNotificationError && (
              <Notification
                marginTop="mt-0"
                textColor="text-[#710D06]"
                bgColor="bg-[#FDD9D7]"
                progressBarColor="bg-red-300"
                borderColor="border-[#E21B0C]"
                xColor="text-[#E21B0C]"
                xHoverColor="hover:text-[#B91509]"
                message={notificationMessage}
                onClose={() => setShowNotificationError(false)}
              />
            )}
            {paymentResult.error && (
              <Notification
                marginTop="mt-0"
                textColor="text-[#710D06]"
                bgColor="bg-[#FDD9D7]"
                progressBarColor="bg-red-300"
                borderColor="border-[#E21B0C]"
                xColor="text-[#E21B0C]"
                xHoverColor="hover:text-[#B91509]"
                message={paymentResult.message}
                onClose={() =>
                  setPaymentResult((prevPaymentResult) => ({
                    ...prevPaymentResult,
                    error: false,
                    message: ""
                  }))
                }
              />
            )}
            {paymentResult.sucess && (
              <Notification
                marginTop="mt-0"
                textColor="text-[#245026]"
                bgColor="bg-[#E0F1E1]"
                progressBarColor="bg-green-300"
                borderColor="border-[#47A04B]"
                xColor="text-[#47A04B]"
                xHoverColor="hover:text-[#3D8F41]"
                message={paymentResult.message}
                onClose={() =>
                  setPaymentResult((prevPaymentResult) => ({
                    ...prevPaymentResult,
                    sucess: false,
                    message: ""
                  }))
                }
              />
            )}  
          </div>
          <div
            id="line"
            className="border-t border-[#E2E8F0] md:mb-[1.125rem] md:mt-[1.031rem] md:mx-[0.563rem] lg:mb-[1.5rem] lg:mt-[1.375rem] lg:mx-[0.75rem]"
          ></div>
          <div className="flex justify-between w-full md:gap-[1.5rem] lg:gap-[2rem] md:px-[1.125rem] px-[1.5rem] lg:px-[1.5rem]">
            <div id="bar-code-area" className="lg:max-w-full flex-grow">
              <h1
                title="Código de barras"
                className="md:pb-[0.281rem] pb-[0.375rem] lg:pb-[0.375rem] text-[#00253F] font-medium"
              >
                Código de barras
              </h1>
              <div className="flex flex-row-reverse items-center relative">
                <Input
                  id="bar-code-input"
                  className="text-[#00253F] font-normal"
                  title="Digite o código de barras"
                  placeholder="Digite o código de barras"
                  value={inputValue}
                  onInput={handleInputChange}
                ></Input>
                <Image
                  className="pr-[0.625rem] absolute"
                  src="bar-code-icon.svg"
                  alt="bar code"
                  width="30"
                  height="30"
                ></Image>
              </div>
            </div>
            <WarningArea />
          </div>
          <Button
            id="submit-button"
            title="Continuar"
            className={`${
              isButtonDisabled
                ? "bg-[#64748B]"
                : "bg-[#00253F] hover:bg-[#00225C]"
            } mt-auto md:mb-[0.844rem] md:mr-[1.125rem] mb-[1.125rem] mr-[1.5rem] lg:mb-[1.125rem] lg:mr-[1.5rem] self-end`}
            onClick={() => {
              if (isButtonDisabled) {
                setShowNotificationError(true);
                setNotificationMessage("Preencha o código de barras");
              } else {
                handleSubmit();
              }
            }}
          >
            Continuar
          </Button>
        </div>
      )}
    </PaymentData>
  );
}
