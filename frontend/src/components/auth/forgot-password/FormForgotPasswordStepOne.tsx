import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ForgotPasswordData, forgotPasswordSchema } from "../../../app/schemas/forgot/schemas";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



interface StepOneProps {
  onSubmit: (email: string) => Promise<void>;
}

export function FormForgotPasswordStepOne({ onSubmit }: StepOneProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') || "",
    },
  });

  const handleSubmit = async (formData: ForgotPasswordData) => {
    try {
      setIsLoading(true);
      await onSubmit(formData.email);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="min-w-96 lg:max-w-96 my-auto"
      aria-labelledby="title"
      noValidate
    >
      <h1
        id="title"
        className="w-full lg:max-w-96 xl:max-w-96 text-lg text-center font-semibold leading-tight mb-2 lg:mb-2 text-[#1E293B]"
      >
        Esqueceu sua senha?
      </h1>
      <p id="title-2" className="text-sm text-center mb-8">
        Digite abaixo um e-mail cadastrado para receber as instruções.
      </p>
  
      <FormItem className="mb-14">
        <FormLabel 
          id="label-email" 
          htmlFor="email" 
          className="text-[#00253F]"
        >
          E-mail
        </FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="exemplo@mail.com"
          className="p-2 w-full text-[#00253F] placeholder-custom"
          disabled={isLoading}
          aria-required="true"
          aria-invalid={!!form.formState.errors.email}
          aria-describedby="email-error"
          {...form.register("email")}
        />
        <FormMessage id="email-error">
          {form.formState.errors.email?.message}
        </FormMessage>
      </FormItem>
  
      <Button
        id="enter-btn"
        type="submit"
        disabled={!form.formState.isValid || isLoading}
        className="w-full bg-[#00253F] mb-3 hover:bg-[#00225C]"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            className="h-4 w-4 animate-spin "
            aria-label="Carregando"
          />
        ) : (
          "Enviar"
        )}
      </Button>
  
      <p className="text-[#00253F] text-center mx-auto font-medium mb-8">
        <Link
          id="back-link"
          href="/"
          className="text-[#00253F] font-medium text-sm hover:text-[#8295b4]"
          aria-label="Voltar para o login"
        >
          Voltar
        </Link>
      </p>
    </form>
  </Form>
  );
}