import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/messaging';
import logger from 'logger';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  WEB_NOTIFICATIONS_PAGE: string;
  constructor() {
    const serviceAccountPath = path.resolve(
      process.cwd(),
      './firebaseAccountKey.json',
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });

    const webNotificationsPage = process.env.WEB_NOTIFICATIONS_PAGE;

    if (!webNotificationsPage)
      throw new Error('Web notification page was not provided');
    this.WEB_NOTIFICATIONS_PAGE = webNotificationsPage;
  }

  async sendPushNotification(token: string, title: string, body: string) {
    const message: Message = {
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        fcmOptions: {
          link: this.WEB_NOTIFICATIONS_PAGE,
        },
      },
    };
    try {
      const response = await admin.messaging().send(message);
      logger.info(`Successfully sent message: ${response}`);
    } catch (error) {
      logger.error(`Error sending message: ${error}`);
      throw new InternalServerErrorException(
        'Não foi possível enviar a notificação',
      );
    }
  }
}
