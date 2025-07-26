import {z} from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Insira um e-mail válido.",
  }),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula.",
    })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula.",
    })
    .regex(/[0-9]/, {
      message: "A senha deve conter pelo menos um número.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "A senha deve conter pelo menos um caractere especial.",
    })
    .regex(/^\S*$/, {
      message: "A senha não pode conter espaços.",
    })
    .regex(/^[\x00-\x7F]*$/, {
      message: "A senha não pode conter emojis.",
    }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
 
