import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notifications-response.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly firebaseService: FirebaseService,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async sendNotification(userId: string, title: string, body: string) {
    const user = await this.userService.findOneByOrFail('id', userId);

    const token = user.deviceToken;

    if (!token) return;
    await this.firebaseService.sendPushNotification(token, title, body);

    await this.saveNotification(user, title, body);
  }

  async saveNotification(user: User, title: string, body: string) {
    const newNotificationDto = new CreateNotificationDto(title, body, user);
    const newNotificationEntity =
      this.notificationRepository.create(newNotificationDto);

    await this.notificationRepository.save(newNotificationEntity);
  }

  async getAllUserNotifications() {
    const userId = await this.userService.extractUserIdFromToken();

    const userNotifications = await this.notificationRepository.find({
      where: {
        user: { id: userId },
      },
      select: ['id', 'title', 'description', 'seen', 'createdAt'],
    });

    return userNotifications.map((notification) => this.mapToDto(notification));
  }

  private mapToDto(notification: any): NotificationResponseDto {
    return {
      id: notification.id,
      title: notification.title,
      description: notification.description,
      seen: notification.seen,
      createdAt: notification.createdAt,
    };
  }

  async markNotificationAsSeen(notificationId: string) {
    await this.notificationRepository.update(notificationId, {
      seen: true,
    });
  }
}
