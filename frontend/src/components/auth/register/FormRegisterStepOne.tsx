import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/contexts/RegisterContext";
import { useRouter } from 'next/navigation';
import { RegisterFormData, registerFormSchema } from "../../../app/schemas/register/schemas";


export function validateMinLength(value: string, minLength: number) {
  const trimmedValue = value.trim();
  const compactValue = value.replace(/\s/g, "");

  if (trimmedValue.slice(0, minLength).includes(" ")) {
    return false;
  }

  return compactValue.length >= minLength;
}


export function FormRegisterStepOne() {
  const router = useRouter();
  const { formData, nextStep, updateFormData, isEditing, setIsEditing, setCurrentStep } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
    defaultValues: formData,
  });

  function validateInput(event: React.KeyboardEvent<HTMLInputElement>) {
    const target = event.currentTarget;

    const char = event.key;
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (target.value.trim().length < 3 && char === " ") {
      event.preventDefault();
      return;
    }

    if (!regex.test(char)) {
      event.preventDefault();
    }
  }

  async function onSubmit(values: RegisterFormData) {
    updateFormData(values);

    if (isEditing) {      
      setIsEditing(false); 
      setCurrentStep(4); 
    } else {    
      nextStep();
    }
  }

  const handleLoginClick = () => {   
    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-96 lg:max-w-96 my-auto"
      >
        <h1 id="title" className="w-full lg:max-w-96 xl:max-w-96 text-lg text-center font-semibold leading-tight mb-2 lg:mb-2 text-[#1E293B]">
          Olá, seja bem-vindo(a)!
        </h1>
        <p id="title-2" className="text-sm text-center mb-8">
          Insira algumas informações para que possamos começar
        </p>
        <FormItem className="mb-4">
          <FormLabel id="label-name" htmlFor="name" className="text-[#00253F]">
            Nome Completo
          </FormLabel>
          <Input
            id="name"
            type="text"
            placeholder="Digite aqui"
            {...form.register("name")}
            className={`p-2 w-full text-[#00253F] placeholder-custom ${
              form.formState.errors.name ? "border-red-500" : ""
            }`}
            onKeyPress={(event) => validateInput(event)}
          />
          {form.formState.errors.name && (
            <FormMessage>{form.formState.errors.name.message}</FormMessage>
          )}
        </FormItem>
        <FormItem className="mb-4">
          <FormLabel id="label-email" htmlFor="email" className="text-[#00253F]">
            E-mail
          </FormLabel>
          <Input
            id="email"
            type="text"
            placeholder="exemplo@mail.com"
            {...form.register("email")}
            className={`p-2 w-full text-[#00253F] placeholder-custom ${
              form.formState.errors.email ? "border-red-500" : ""
            }`}
          />
          {form.formState.errors.email && (
            <FormMessage>{form.formState.errors.email.message}</FormMessage>
          )}
        </FormItem>
        <FormItem className="mb-14">
          <FormLabel id="label-password" htmlFor="password" className="text-[#00253F]">
            Senha
          </FormLabel>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite aqui"
              {...form.register("password")}
              className={`w-full pr-10 ${
                form.formState.errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              id="show-password-btn"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="text-gray-500 h-4 w-4"
              />
            </button>
          </div>
          {form.formState.errors.password && (
            <FormMessage className="max-w-96">
              {form.formState.errors.password.message}
            </FormMessage>
          )}
        </FormItem>
        <Button
          type="submit"
          id="next-btn"
          disabled={!form.formState.isValid}
          className="w-full bg-[#00253F] mb-3 hover:bg-[#00225C]"          
        >
           {isEditing ? "Salvar" : "Próximo"}
        </Button>        
        {!isEditing && (
          <p className="text-[#00253F] text-center mx-auto text-sm font-medium mb-8">
            Já possui uma conta?{" "}
            <a
              id="enter"              
              onClick={handleLoginClick}
              className="text-[#0055E7] hover:text-[#000] cursor-pointer"
            >
              Entrar
            </a>
          </p>
        )}
        <div className="flex justify-center">
          <Image src="/step-one.svg" alt="teste" width={72} height={6} />
        </div>
      </form>
    </Form>
  );
}
