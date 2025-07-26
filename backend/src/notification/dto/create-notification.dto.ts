import { User } from '@/src/user/entities/user.entity';

export class CreateNotificationDto {
  title: string;
  description: string;
  createdAt: Date;
  seen: boolean;
  user: User;

  constructor(title: string, description: string, user: User) {
    this.title = title;
    this.description = description;
    this.user = user;
    this.seen = false;

    const now = new Date();
    now.setHours(now.getHours() - 3);
    this.createdAt = now;
  }
}
