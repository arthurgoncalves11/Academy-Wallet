import { z } from "zod";
import { validateMinLength } from "../../../components/auth/register/FormRegisterStepOne";
import { isValidCPF } from "../../../components/auth/register/FormRegisterStepTwo";

export const registerFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome completo é obrigatório." })
    .min(3, {
      message: "O nome deve ter no mínimo 3 letras.",
    })
    .regex(/^[^\s]{3,}(?:\s+[^\s]+)+$/, {
      message: "O nome completo deve conter pelo menos dois nomes.",
    })
    .max(150, { message: "O nome não pode ter mais de 150 caracteres." })
    .refine((name) => validateMinLength(name, 3), {
      message: "O nome deve ter no mínimo 3 letras.",
    }),
  email: z.string().email({
    message: "Insira um e-mail válido.",
  }),
  password: z
    .string()
    .min(8, {
      message:
        "A senha deve incluir letra maiúscula, minúscula, número e caractere especial.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      {
        message:
          "A senha deve incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.",
      }
    )
    .regex(/^\S*$/, {
      message: "A senha não pode conter espaços.",
    })
    .regex(/^[\x00-\x7F]*$/, {
      message: "A senha não pode conter emojis.",
    })    
    .regex(/^\S*$/, {
      message: "A senha não pode conter espaços.",
    })
    .regex(/^[\x00-\x7F]*$/, {
      message: "A senha não pode conter emojis.",
    }),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;


// step 2

export const registerStepTwoSchema = z.object({
  cpf: z
    .string()
    .nonempty("CPF é obrigatório")
    .refine(isValidCPF, "Dados inválidos"),

  rg: z
    .string()
    .nonempty("RG é obrigatório")
    .min(7, "RG deve ter pelo menos 7 caracteres"),
});

export type RegisterStepTwoData = z.infer<typeof registerStepTwoSchema>;


// step 3

export const registerStepThreeSchema = z.object({
  transactionPassword: z
    .string()
    .nonempty("Senha é obrigatória")
    .max(6)
    .min(6, "Senha deve possuir 6 dígitos"),
});

export type RegisterStepThreeData = z.infer<typeof registerStepThreeSchema>;