import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { PasswordFormData, passwordSchema } from "../../../app/schemas/forgot/schemas";

interface StepThreeProps {
  onSubmit: (data: { password: string }) => Promise<void>;
  onBack: () => void;
}

export function FormForgotPasswordStepThree({ onSubmit }: StepThreeProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: PasswordFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ password: data.password });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const password = form.watch("password");
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
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
          Nova senha
        </h1>
        <p id="title-2" className="text-sm text-center mb-8">
          Digite sua nova senha
        </p>

        <FormItem className="mb-4">
          <FormLabel
            id="label-password"
            htmlFor="password"
            className="text-[#00253F]"
          >
            Nova senha
          </FormLabel>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite aqui"
              aria-required="true"
              aria-describedby="password-error"
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
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="text-gray-500 h-4 w-4"
              />
            </button>
          </div>
          {form.formState.errors.password && (
            <FormMessage
              className="max-w-96"
              id="password-error"
              role="alert"
              aria-live="assertive"
            >
              {form.formState.errors.password.message}
            </FormMessage>
          )}
        </FormItem>

        <div className="ml-2 mb-6">
          <ul className="text-[#64748B]">
            <li>
              {rules.length ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-xs mr-2 text-[#357838]"
                />
              ) : (
                <FontAwesomeIcon icon={faCircle} className="mr-2 text-[8px]" />
              )}
              No mínimo 8 caracteres
            </li>
            <li>
              {rules.uppercase ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-xs mr-2 text-[#357838]"
                />
              ) : (
                <FontAwesomeIcon icon={faCircle} className="mr-2 text-[8px]" />
              )}
              1 letra maiúscula
            </li>
            <li>
              {rules.lowercase ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-xs mr-2 text-[#357838]"
                />
              ) : (
                <FontAwesomeIcon icon={faCircle} className="mr-2 text-[8px]" />
              )}
              1 letra minúscula
            </li>
            <li>
              {rules.number ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-xs mr-2 text-[#357838]"
                />
              ) : (
                <FontAwesomeIcon icon={faCircle} className="mr-2 text-[8px]" />
              )}
              1 número
            </li>
            <li>
              {rules.special ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-xs mr-2 text-[#357838]"
                />
              ) : (
                <FontAwesomeIcon icon={faCircle} className="mr-2 text-[8px]" />
              )}
              1 caractere especial (!@#$%&*)
            </li>
          </ul>
        </div>

        <FormItem className="mb-14">
          <FormLabel
            id="label-confirm-password"
            htmlFor="confirmPassword"
            className="text-[#00253F]"
          >
            Confirmar senha
          </FormLabel>
          <div className="relative w-full">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Digite aqui"
              aria-required="true"
              aria-describedby="confirm-password-error"
              {...form.register("confirmPassword")}
              className={`w-full pr-10 ${
                form.formState.errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              id="show-confirm-password-btn"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Esconder senha" : "Mostrar senha"
              }
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="text-gray-500 h-4 w-4"
              />
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <FormMessage
              className="max-w-96"
              id="confirm-password-error"
              role="alert"
              aria-live="assertive"
            >
              {form.formState.errors.confirmPassword.message}
            </FormMessage>
          )}
        </FormItem>

        <div className="flex flex-col gap-3">
          <Button
            id="confirm"
            type="submit"
            disabled={!form.formState.isValid}
            className="w-full bg-[#00253F] mb-3 hover:bg-[#00225C]"
            aria-disabled={!form.formState.isValid}
            aria-label="Confirmar"
          >
            {isSubmitting ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="h-4 w-4 animate-spin"
                aria-label="Carregando"
              />
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
