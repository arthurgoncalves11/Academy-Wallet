import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export function IsValidPassword() {
  return applyDecorators(
    IsString(),
    IsNotEmpty({ message: 'A senha de login é obrigatória.' }),
    MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
    Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])/, {
      message:
        'A senha deve incluir pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.',
    }),
  );
}
