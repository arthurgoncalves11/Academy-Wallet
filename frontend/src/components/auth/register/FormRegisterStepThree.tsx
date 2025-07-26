import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormMessage } from "../../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";
import Image from "next/image";
import { useState } from "react";
import { TransactionPasswordInput } from "../../transactionPasswordInput";
import { useRegister } from "@/contexts/RegisterContext";
import { RegisterStepThreeData, registerStepThreeSchema } from "../../../app/schemas/register/schemas";



export function FormRegisterStepThree() {

  const { formData, nextStep, prevStep, updateFormData, isEditing, setIsEditing, setCurrentStep } = useRegister();

  const form = useForm<RegisterStepThreeData>({
    resolver: zodResolver(registerStepThreeSchema),
    mode: "onBlur",
    defaultValues: formData,
  });

 
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = (complete: boolean, password: string) => {
    setIsComplete(complete);
    if (complete) {
      updateFormData({ transactionPassword: password });
    }
  };

  const onSubmit: SubmitHandler<RegisterStepThreeData> = () => {
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
          Hora de criar uma senha
        </h1>
        <p id="title-2" className="text-sm text-center mb-8 max-w-96">
          Crie uma senha <span className="font-bold">numérica </span> para suas
          transações
        </p>
        <div id="password" className="min-w-96 max-w-96 gap-3 mb-14 flex justify-center">
          <TransactionPasswordInput 
            onComplete={handleComplete}
            aria-required="true"
            aria-describedby="password-error"
          />
        </div>
        {form.formState.errors.transactionPassword && (
          <FormMessage id="password-error" role="alert" aria-live="assertive">
            {form.formState.errors.transactionPassword.message}
          </FormMessage>
        )}
        <Button
          type="button"
          id="next-btn"
          disabled={!isComplete}
          className="w-full bg-[#00253F] mb-5 hover:bg-[#00225C]"
          onClick={nextStep}
          aria-disabled={!isComplete}
          aria-label="Próximo"
        >
          Próximo
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
          <Image src="/step-three.svg" alt="Ilustração de uma etapa" width={72} height={6} />
        </div>
      </form>
    </Form>
  )
  
  
}
