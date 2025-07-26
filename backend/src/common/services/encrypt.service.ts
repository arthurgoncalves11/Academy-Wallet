import { BadRequestException, Injectable } from '@nestjs/common';
import { generateKeyPairSync, privateDecrypt } from 'crypto';

@Injectable()
export class EncryptService {
  private PASSPRHASE: string;

  constructor() {
    const passphrase = process.env.CRYPT_PASSPHRASE;

    if (!passphrase) throw new Error('Crypt passprhase was not provided');

    this.PASSPRHASE = passphrase;
  }

  generateKeyPair(): KeyPair {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: this.PASSPRHASE,
      },
    });

    return {
      publicKey,
      privateKey,
    };
  }

  decrypt(encryptedText: string, privateKey: string) {
    try {
      return privateDecrypt(
        {
          key: privateKey,
          passphrase: this.PASSPRHASE,
        },
        Buffer.from(encryptedText, 'base64'),
      ).toString('utf8');
    } catch {
      throw new BadRequestException(
        'Chave pra descriptografia de senha inválida',
      );
    }
  }
}

type KeyPair = {
  publicKey: string;
  privateKey: string;
};
