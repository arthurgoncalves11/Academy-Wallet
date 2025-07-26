"use client";

import { Header } from "@/components/auth/Header";
import Image from "next/image";
import { PasswordRecoveryFlow } from "@/components/auth/forgot-password/PasswordRecoveryFlow";

export default function ForgotMyPassword() {
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
            <PasswordRecoveryFlow />
          </div>
        </section>
      </main>
    </div>
  );
}
