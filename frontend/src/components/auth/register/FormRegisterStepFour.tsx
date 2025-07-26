import { useForm } from "react-hook-form";
import { Form, FormItem, FormLabel } from "../../ui/form";
import { Button } from "../../ui/button";
import Image from "next/image";
import { Input } from "../../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useRegister } from "@/contexts/RegisterContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function FormRegisterStepFour() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { formData, handleEditField, prevStep, resetForm } = useRegister();
  const form = useForm({
    defaultValues: formData,
  });

  const removeMask = (maskedValue: string) => {
    return maskedValue.replace(/\D/g, '');
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const cleanedCpf = removeMask(formData.cpf);
    const cleanedRg = removeMask(formData.rg);

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        loginPassword: formData.password,
        cpf: cleanedCpf,
        rg: cleanedRg,
        transactionsPassword: formData.transactionPassword
      };


      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });


      if (response.status === 409) {
        toast.error('E-mail, CPF ou RG já cadastrados');
        return;
      }

      if (!response.ok) throw new Error();

      resetForm();

      router.push('/');
      toast.success('Usuário cadastrado com sucesso!');

    } catch (error) {
      console.error('Erro completo:', error);
      toast.error('Erro ao cadastrar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
    <form      
      className="min-w-96 lg:max-w-96 my-auto"
      aria-live="polite"
      noValidate
    >
      <h1
        id="title"
        className="w-full lg:max-w-96 xl:max-w-96 text-lg text-center font-semibold leading-tight mb-2 lg:mb-2 text-[#1E293B]"
      >
        Está tudo certinho?
      </h1>
      <p id="title-2" className="text-sm text-center mb-8 max-w-96">
        Confira seus dados
      </p>
      <FormItem className="mb-4 space-y-0">
        <FormLabel
          id="label-name"
          htmlFor="name"
          className="text-[#64748B] mb-0"
        >
          Nome
        </FormLabel>
        <div className="flex">
          <Input
            id="name"
            type="text"
            className="border-none p-0 h-6"
            value={formData.name}
            aria-required="true"
            aria-describedby="name-error"
            disabled
          />
          <button
            type="button"
            id="edit-name"
            onClick={() => handleEditField(1, "name")}
            aria-label="Editar nome"
          >
            <Image src="/pen.svg" alt="Editar nome" width={20} height={20} />
          </button>
        </div>
      </FormItem>
      <FormItem className="mb-4 space-y-0">
        <FormLabel
          id="label-email"
          htmlFor="email"
          className="text-[#64748B]"
        >
          E-mail
        </FormLabel>
        <div className="flex">
          <Input
            id="email"
            type="text"
            className="border-none p-0 h-6"
            value={formData.email}
            aria-required="true"
            aria-describedby="email-error"
            disabled
          />
          <button id="edit-email" onClick={() => handleEditField(1, "email")} aria-label="Editar e-mail">
            <Image src="/pen.svg" alt="Editar e-mail" width={20} height={20} />
          </button>
        </div>
      </FormItem>
      <FormItem className="mb-4 space-y-0">
        <FormLabel
          id="label-password"
          htmlFor="password"
          className="text-[#64748B]"
        >
          Senha
        </FormLabel>
        <div className="flex">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="border-none p-0 h-6"
            value={formData.password}
            aria-required="true"
            aria-describedby="password-error"
            disabled
          />
          <button
            id="show-password-btn"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="text-gray-500 h-4 w-4 pr-2"
            />
          </button>
          <button
            id="edit-password"
            onClick={() => handleEditField(1, "password")}
            aria-label="Editar senha"
          >
            <Image src="/pen.svg" alt="Editar senha" width={22} height={22} />
          </button>
        </div>
      </FormItem>
      <FormItem className="mb-4 space-y-0">
        <FormLabel id="label-cpf" htmlFor="cpf" className="text-[#64748B]">
          CPF
        </FormLabel>
        <div className="flex">
          <Input
            id="cpf"
            type="text"
            className="border-none p-0 h-6"
            value={formData.cpf}
            aria-required="true"
            aria-describedby="cpf-error"
            disabled
          />
          <button id="edit-cpf" onClick={() => handleEditField(2, "cpf")} aria-label="Editar CPF">
            <Image src="/pen.svg" alt="Editar CPF" width={20} height={20} />
          </button>
        </div>
      </FormItem>
      <FormItem className="mb-14 space-y-0">
        <FormLabel id="label-rg" htmlFor="rg" className="text-[#64748B]">
          RG
        </FormLabel>
        <div className="flex">
          <Input
            id="rg"
            type="text"
            className="border-none p-0 h-6"
            value={formData.rg}
            aria-required="true"
            aria-describedby="rg-error"
            disabled
          />
          <button id="edit-rg" onClick={() => handleEditField(2, "rg")} aria-label="Editar RG">
            <Image src="/pen.svg" alt="Editar RG" width={20} height={20} />
          </button>
        </div>
      </FormItem>
      <Button
        type="submit"
        id="enter-btn"
        className="w-full bg-[#00253F] mb-5 hover:bg-[#00225C]"
        disabled={isLoading}
        onClick={handleSubmit}
        aria-disabled={isLoading}
        aria-label="Entrar"
      >
        Entrar
      </Button>
      <p className="text-[#00253F] text-center mx-auto font-medium mb-8">
        <a
          id="back-link"
          href="#"
          className="text-[#00253F] font-medium text-sm  hover:text-[#00225C]"
          onClick={prevStep}
          role="link"
        >
          Voltar
        </a>
      </p>
      <div className="flex justify-center">
        <Image src="/step-four.svg" alt="Ilustração de uma etapa" width={72} height={6} />
      </div>
    </form>
  </Form>
  
  );
}
