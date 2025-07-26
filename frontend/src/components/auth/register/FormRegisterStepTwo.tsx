import { Form, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRegister } from "@/contexts/RegisterContext";
import { handleCPFInput } from "@/utils/cpfMask";
import { RegisterStepTwoData, registerStepTwoSchema } from "../../../app/schemas/register/schemas";

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0,
    remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;

  return remainder === parseInt(cpf.substring(10, 11));
}

export function FormRegisterStepTwo() {

  const { formData, nextStep, prevStep, updateFormData, isEditing, setIsEditing, setCurrentStep } = useRegister();

  const form = useForm<RegisterStepTwoData>({
    resolver: zodResolver(registerStepTwoSchema),
    mode: "onBlur",
    defaultValues: formData,
  });

  const {
    register,
    formState: { errors },
  } = form;


  const handleRGInput = (event: React.FormEvent<HTMLInputElement>) => {
    let value = event.currentTarget.value;

    value = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);   

    event.currentTarget.value = value;
  };

  const onSubmit: SubmitHandler<RegisterStepTwoData> = (values) => {
    updateFormData(values);
    if (isEditing) {
      setIsEditing(false);
      setCurrentStep(4);
    } else {
      nextStep();
    }
  };

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="min-w-96 lg:max-w-96 my-auto"
      aria-live="polite"
      noValidate
    >
      <h1 id="title" className="w-full lg:max-w-96 xl:max-w-96 text-lg text-center font-semibold leading-tight mb-2 lg:mb-2 text-[#1E293B]">
        {formData.name},
      </h1>
      <p id="title-2" className="text-sm text-center mb-8 max-w-96">
        Só mais algumas informações e você poderá explorar o universo do{" "}
        <span className="font-bold">Academy Wallet</span>
      </p>
  
      <FormItem className="mb-4">
        <FormLabel id="label-cpf" htmlFor="cpf" className="text-[#00253F]">
          CPF
        </FormLabel>
        <Input
          id="cpf"
          type="text"
          placeholder="000.000.000-00"
          aria-required="true"
          aria-describedby="cpf-error"
          {...register("cpf")}
          maxLength={14}
          onInput={handleCPFInput}
          className={`p-2 w-full text-[#00253F] placeholder-custom ${errors.cpf ? "border-red-500" : ""}`}
        />
        {errors.cpf && (
          <FormMessage id="cpf-error" role="alert" aria-live="assertive">
            {errors.cpf.message}
          </FormMessage>
        )}
      </FormItem>
  
      <FormItem className="mb-14">
        <FormLabel id="label-rg" htmlFor="rg" className="text-[#00253F]">
          RG
        </FormLabel>
        <Input
          id="rg"
          type="text"
          placeholder="0000000"
          aria-required="true"
          aria-describedby="rg-error"
          {...form.register("rg")}
          maxLength={13}
          onInput={handleRGInput}
          className={`p-2 w-full text-[#00253F] placeholder-custom ${form.formState.errors.rg ? "border-red-500" : ""}`}
        />
        {form.formState.errors.rg && (
          <FormMessage id="rg-error" role="alert" aria-live="assertive">
            {form.formState.errors.rg.message}
          </FormMessage>
        )}
      </FormItem>
  
      <Button
        type="submit"
        id="next-btn"
        disabled={!form.formState.isValid}
        className="w-full bg-[#00253F] mb-5 hover:bg-[#00225C]"
        aria-disabled={!form.formState.isValid}
        aria-label={isEditing ? "Salvar" : "Próximo"}
      >
        {isEditing ? "Salvar" : "Próximo"}
      </Button>
      {!isEditing && (
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
      )}
      <div className="flex justify-center">
        <Image src="/step-two.svg" alt="Ilustração de uma etapa" width={72} height={6} />
      </div>
    </form>
  </Form>
  
  );
}
