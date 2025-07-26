"use client";

import Image from "next/image";
import { Header } from "@/components/auth/Header";
import { FormRegisterStepOne } from "@/components/auth/register/FormRegisterStepOne";
import { FormRegisterStepTwo } from "@/components/auth/register/FormRegisterStepTwo";
import { FormRegisterStepThree } from "@/components/auth/register/FormRegisterStepThree";
import { FormRegisterStepFour } from "@/components/auth/register/FormRegisterStepFour";
import { useRegister } from "@/contexts/RegisterContext";

export default function RegisterPage() {
  const { currentStep } = useRegister();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FormRegisterStepOne />;
      case 2:
        return <FormRegisterStepTwo />;
      case 3:
        return <FormRegisterStepThree />;
      case 4:
        return <FormRegisterStepFour />;
      default:
        return <FormRegisterStepOne />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex-grow min-h-[calc(100vh-88px)] max-w-[1440px] xxlg:mx-auto flex justify-between">
        <aside className="w-0 sl:w-[43%] flex-shrink-0 flex items-center">
          <Image
            id="image"
            src="/photo-register.png"
            alt="Mulher sorridente com cabelo cacheado segurando um smartphone e um cartão bancário, com fundo amarelo vibrante."
            layout="responsive"
            width={0}
            height={0}
            className="auto-size"
            priority
            aria-labelledby="image-description"
          />
          <p id="image-description" className="sr-only">
            Mulher sorridente com cabelo cacheado segurando um smartphone e um
            cartão bancário, com fundo amarelo vibrante.
          </p>
        </aside>
        <section className="flex-1">
          <div className="min-w-96 max-w-96 min-h-full mx-auto flex items-center">
            {renderStep()}
          </div>
        </section>
      </main>
    </div>
  );
}
