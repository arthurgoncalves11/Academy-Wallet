import { z } from "zod";

export const forgotPasswordSchema = z.object({
  
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  });
  
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

//step 2

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial")
    .regex(/^\S*$/, {
      message: "A senha não pode conter espaços.",
    })
    .regex(/^[\x00-\x7F]*$/, {
      message: "A senha não pode conter emojis.",
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

//step 3

export const otpSchema = z.object({
    otp: z.string().refine(
      (code) => code.length === 4 || code.length === 0,
      "Código deve ter 4 dígitos"
    )
  });
  
export type OtpFormData = z.infer<typeof otpSchema>;