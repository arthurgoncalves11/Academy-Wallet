import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceTokenDto {
  @ApiProperty({
    example:
      'fWUnIcKaJcM7cqNVpLRGnx:APA91bGjFaGpnhU50xw8jOTOlugsVwR4X4_G6CwSGjAh8J0E953iaqe0E-2AnynShpwcoYDKXcFXHnu41Qf5UduJ9_3SUWeLWqfFk1T-Ws9JDAlLuKr9hew',
    description: 'Token do dispositivo',
  })
  @IsString()
  @IsNotEmpty({ message: 'O Token do dispositivo é obrigatório.' })
  token: string;
}
