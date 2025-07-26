import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'ID único da notificação',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id: string;

  @ApiProperty({
    description: 'Título da notificação',
    example: 'Novo Comentário',
  })
  title: string;

  @ApiProperty({
    description: 'Conteúdo da notificação',
    example: 'Você recebeu um novo comentário em seu post',
  })
  description: string;

  @ApiProperty({
    description: 'Indica se a notificação foi vista',
    example: false,
  })
  seen: boolean;

  @ApiProperty({
    description: 'Data de criação da notificação',
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;
}
