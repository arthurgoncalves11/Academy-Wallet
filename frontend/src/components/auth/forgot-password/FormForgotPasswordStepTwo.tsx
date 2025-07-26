import { Button } from "@/components/ui/button";
import { Form, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { OtpCodeInput } from "@/components/OtpCode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { OtpFormData, otpSchema } from "../../../app/schemas/forgot/schemas";



interface StepTwoProps {
  onSubmit: (otp: string) => Promise<boolean>;
  onBack: () => void;
  onResendCode: () => void;
  email: string;
}

export function FormForgotPasswordStepTwo({
  onSubmit,
  onBack,
  onResendCode,
  email
}: StepTwoProps) {
  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: ''
    }
  });

  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendCode = () => {
    if (canResend) {
      onResendCode();
      setCountdown(59);
      setCanResend(false);
      form.reset();
    }
  };

  const handleOtpComplete = async (complete: boolean, code: string) => {
    if (!complete || isSubmitting) return;

    form.setValue('otp', code, {
      shouldValidate: true,
      shouldTouch: true
    });

    setIsSubmitting(true);
    try {
      const success = await onSubmit(code);
      if (!success) {
        form.setError('otp', {
          type: 'manual',
          message: 'Código inválido'
        });
      }
    } catch {
      form.setError('otp', {
        type: 'manual',
        message: 'Erro ao validar código'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: OtpFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(data.otp);
      if (!success) {
        form.setError('otp', {
          type: 'manual',
          message: 'Código inválido'
        });
      }
    } catch {
      form.setError('otp', {
        type: 'manual',
        message: 'Erro ao validar código'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="min-w-96 lg:max-w-96 my-auto"
      aria-live="polite"
      noValidate
    >
      <h1
        id="title"
        className="w-full lg:max-w-96 xl:max-w-96 text-lg text-center font-semibold leading-tight mb-2 lg:mb-2 text-[#1E293B]"
      >
        E-mail enviado
      </h1>
      <p
        id="title-2"
        className="text-sm text-center mb-8"
      >
        Verifique seu e-mail, enviamos um código para você <span className="text-[#0055E7]">{email}</span>
      </p>
  
      <div className="flex flex-col items-center mb-8">
        <FormItem className="w-full">
          <div
            id="otp"
            className="flex flex-col items-center gap-3 justify-center"
          >
            <OtpCodeInput 
              onComplete={handleOtpComplete}                 
              aria-required="true"
              aria-describedby="otp-error"
            />
            {isSubmitting && (
              <div className="mt-4">
                <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 animate-spin text-[#0055E7]" aria-label="Carregando" />
              </div>
            )}
          </div>
          {form.formState.errors.otp && (
            <p className="text-sm text-red-500 mt-2 text-center" id="otp-error" role="alert" aria-live="assertive">
              {form.formState.errors.otp.message}
            </p>
          )}
        </FormItem>
      </div>
  
      {countdown > 0 ? (
        <>
          <div className="flex items-center justify-start">
            <button 
              id="resend"
              type="button" 
              disabled
              className="bg-transparent font-normal text-[#1E293B] text-sm mb-2 mx-auto cursor-not-allowed"
              aria-disabled="true"
            >
              Reenviar código
            </button>
          </div>
          <p
            id="count"
            className="text-center text-[#0055E7] text-sm mb-14"
          >
            00:{countdown.toString().padStart(2, '0')}
          </p>
        </>
      ) : (
        <div className="flex items-center justify-start">
          <Button
            id="resend1"
            type="button"
            onClick={handleResendCode}
            disabled={isSubmitting}
            className="bg-transparent font-normal text-[#0055E7] hover:text-[#00225C] text-sm mb-20 mx-auto"
            aria-disabled={isSubmitting}
            aria-label="Reenviar código"
          >
            Reenviar código
          </Button>
        </div>
      )}
  
      <div className="flex items-center justify-start">
        <Button
          id="back-btn"
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-transparent text-[#00253F] mb-3 text-sm mx-auto"
          aria-disabled={isSubmitting}
          aria-label="Voltar"
        >
          Voltar
        </Button>
      </div>
    </form>
  </Form>
  
  );
}