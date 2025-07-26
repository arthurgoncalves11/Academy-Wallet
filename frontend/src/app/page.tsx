"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/auth/Header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginFormData, loginFormSchema } from "./schemas/login/schemas";
import Link from "next/link";
import { toast } from "react-toastify";
import { Footer } from "@/components/auth/Footer";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const { setAuth } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  const { trigger, formState } = form;

  useEffect(() => {
    if (formState.dirtyFields.email) {
      trigger("password");
    }
  }, [formState.dirtyFields.email, trigger]);

  useEffect(() => {
    if (formState.dirtyFields.password) {
      trigger("email");
    }
  }, [formState.dirtyFields.password, trigger]);

  const handleRegisterClick = async () => {
    setIsLoadingRegister(true);
    try {
      await router.push("/auth/register");
    } catch (error) {
      setIsLoadingRegister(false);
      console.error("Erro ao navegar para registro:", error);
    }
  }


  async function handleForgotPasswordClick (e: React.MouseEvent) {
    e.preventDefault();
    const email = form.getValues("email");
     try {
      await router.push(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Erro ao navegar para recuperação de senha:", error);
    }
  };

  

  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Muitas tentativas. Tente novamente em 10 minutos");
          form.setError("root", {
            message: "Muitas tentativas. Tente novamente em 10 minutos",
          });
          return;
        } else if (response.status === 401) {
          toast.error("E-mail ou senha inválidos.");
          form.setError("root", {
            message: "E-mail ou senha inválidos.",
          });
          setIsLoading(false);
          return;
        }
        throw new Error(`Erro ao fazer login: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data.token) {
        throw new Error("Token não recebido do servidor");
      }

      setAuth({ token: data.data.token });
      router.replace("/wallet");
    } catch {
      form.setError("root", {
        message: "Ocorreu um erro ao fazer login. Tente novamente.",
      });
    } finally {
     
    }
  }

  return (
    <div className="min-h-screen">      
      <Header />
      <main className="flex-grow min-h-[calc(100vh-88px)] max-w-[1440px] xxlg:mx-auto flex justify-between">
        <aside className="w-0 sl:w-[43%] flex-shrink-0 flex items-center">
          <Image
            id="image"
            src="/foto-login.png"
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="min-w-96 lg:max-w-96 my-auto"
              >
                <h1
                  id="title"
                  className="w-full lg:max-w-96 xl:max-w-96 text-lg font-semibold leading-tight mb-8 lg:mb-8 text-[#1E293B]"
                >
                  Login
                </h1>
                <FormItem className="mb-6">
                  <FormLabel
                    id="label-email"
                    htmlFor="email"
                    className="text-[#00253F] mb-1"
                  >
                    E-mail
                  </FormLabel>
                  <Input
                    id="email"
                    type="text"
                    placeholder="exemplo@mail.com"
                    {...form.register("email")}
                    className="p-2 w-full text-[#00253F] placeholder-custom"
                    aria-labelledby="label-email"
                  />
                  {form.formState.errors.email && (
                    <FormMessage id="message-error">
                      {form.formState.errors.email.message}
                    </FormMessage>
                  )}
                </FormItem>
                <FormItem className="mb-14">
                  <FormLabel
                    id="label-password"
                    htmlFor="password"
                    className="text-[#00253F]"
                  >
                    Senha
                  </FormLabel>
                  <div className="relative w-full">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite aqui"
                      {...form.register("password")}
                      className="w-full p-2"
                      aria-labelledby="label-password"
                    />
                    <button
                      id="show-password-btn"
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="text-gray-500 h-4 w-4 p-2 text-center"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {form.formState.errors.password && (
                    <FormMessage id="message-error-1">
                      {form.formState.errors.password.message}
                    </FormMessage>
                  )}
                  <Link
                    id="forgot-password-link"
                    href="/auth/forgot-password"
                    onClick={handleForgotPasswordClick}
                    className="text-[#64748B] hover:text-[#475569] text-sm"
                    aria-label="Esqueci minha senha, ir para página de recuperação de senha"
                  >
                    Esqueci minha senha
                  </Link>
                </FormItem>

                <Button
                  id="enter-btn"
                  type="submit"
                  disabled={!form.formState.isValid || isLoading}
                  className="w-full bg-[#00253F] mb-3 hover:bg-[#00225C]"
                >
                  {isLoading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="h-4 w-4 animate-spin"
                    />
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <div className="flex items-center justify-start">
                  <Button
                    id="register-btn"
                    type="button"
                    onClick={handleRegisterClick}
                    className="bg-transparent text-[#00253F] hover:text-[#00225C] mx-auto"
                  >
                     {isLoadingRegister ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="h-4 w-4 animate-spin text-[#00253f]"
                    />
                  ) : (
                    "Cadastre-se"
                  )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
