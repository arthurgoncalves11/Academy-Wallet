import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    example: 'joao@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;
}
