import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MarkNotificationAsSeenDto } from './dto/mark-notifcation-as-seen.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { NotificationResponseDto } from './dto/notifications-response.dto';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter todas as notificações do usuário',
    description: 'Retorna todas as notificações do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações retornada com sucesso',
    type: [NotificationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getAllUserNotifications() {
    return {
      data: await this.notificationService.getAllUserNotifications(),
      message: 'Notificações buscadas com sucesso!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/mark-as-seen')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Marcar notificação como vista',
    description: 'Atualiza o status de uma notificação para "vista"',
  })
  @ApiBody({ type: MarkNotificationAsSeenDto })
  @ApiResponse({
    status: 200,
    description: 'Notificação marcada como vista com sucesso',
    schema: {
      example: { message: 'Notificação marcada como vista com sucesso!' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos na requisição',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async markNotificationAsSeen(
    @Body() markNotificationAsSeenDto: MarkNotificationAsSeenDto,
  ) {
    await this.notificationService.markNotificationAsSeen(
      markNotificationAsSeenDto.notificationId,
    );

    return { message: 'Notificação marcada como vista com sucesso!' };
  }

  //remover
  @Post()
  @HttpCode(200)
  async postNotification(@Body() sendNotificaitonToUser: { userId: string }) {
    await this.notificationService.sendNotification(
      sendNotificaitonToUser.userId,
      'Teste',
      'Esta é uma descrição de uma notificação',
    );
    return { message: 'Notificação enviada com sucesso' };
  }
}
