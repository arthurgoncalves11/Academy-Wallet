import { Injectable } from '@nestjs/common';
import logger from 'logger';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private EMAIL_DOMAIN: string;

  constructor() {
    const emailDomain = process.env.EMAIL_DOMAIN;
    if (!emailDomain) throw new Error('Email domain was not provided');
    this.EMAIL_DOMAIN = emailDomain;

    this.transporter = this.createTransporter();
  }

  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendRecoveryEmail(email: string, token: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `Academy Wallet <${this.EMAIL_DOMAIN}>`,
        to: email,
        subject: 'Recuperação de Senha - Academy Wallet',
        html: this.createEmailBody(token),
      });
      logger.info('Email sent succesfully');
    } catch (error) {
      logger.error('Error sending email:' + error.message);
      throw new Error('Failed to send recovery email');
    }
  }

  private createEmailBody(token: string): string {
    return `
    <body style="background-color:#f5f5f5; margin:0; padding:20px 0">
      <div style="max-width:600px; margin:0 auto">
        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:100%;background:#fff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)" width="100%">
          <tbody>
            <tr>
              <td style="font-size:14px;vertical-align:top;box-sizing:border-box;padding:0" valign="top">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:100%" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="background-color:#1a237e;padding:24px 32px;border-radius:8px 8px 0 0">
                        <h1 style="box-sizing:border-box;color:#ffffff;margin:0;font-weight:700;font-size:24px;line-height:1.5">
                          Academy Wallet
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding:32px 24px">
                        <h1 style="color:#181818;margin:0 0 16px 0;font-weight:700;font-size:24px;line-height:1.5">
                          Token de redefinição de senha
                        </h1>
                        <p style="color:#666666;margin:0;font-size:16px;line-height:1.6">
                          Use o código abaixo para redefinir sua senha.<br>
                          Válido por <strong>5 minutos</strong>
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:0 24px 24px 24px">
                        <div style="background-color:#ece3fb; border-radius:8px; padding:24px; text-align:center">
                          <p style="color:#181818;margin:0;font-weight:700;font-size:32px;letter-spacing:2px">
                            ${token}
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding:0 24px 32px 24px">
                        <div style="color:#666666;font-size:14px">
                          <img src="https://fonts.gstatic.com/s/e/notoemoji/16.0/26a0_fe0f/72.png" 
                               alt="⚠️" 
                               style="width:20px;height:20px;vertical-align:middle;margin-right:8px">
                          Não compartilhe este token com ninguém
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>`;
  }
}
