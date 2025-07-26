import { Injectable } from '@nestjs/common';
import { hashSync as bcryptHashSync } from 'bcryptjs';
import logger from 'logger';

@Injectable()
export class PasswordService {
  hashPassword(password: string | number) {
    logger.info('Hasheando senha');
    const round_salts = Number(process.env.SALTS);
    if (!round_salts) throw new Error('Round salts was not provided');

    return bcryptHashSync(password.toString(), round_salts);
  }
}
