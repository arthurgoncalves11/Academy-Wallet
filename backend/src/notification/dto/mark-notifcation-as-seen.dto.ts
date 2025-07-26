import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MarkNotificationAsSeenDto {
  @ApiProperty({
    example: '27b1abe5-475f-402b-970b-6405ca0c9d9d',
    description: 'ID da notificação',
    required: true,
  })
  @IsUUID()
  notificationId: string;
}
