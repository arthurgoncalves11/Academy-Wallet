import { ApiProperty } from '@nestjs/swagger';

export class GetCryptKeyDto {
  @ApiProperty({
    example: '87ads90f7a89dfuajkldfakl;sdfkadf',
    description: 'Chave de criptografia do usuário',
  })
  data: {
    cryptKey: string;
  };
  constructor(cryptKey: string) {
    this.data.cryptKey = cryptKey;
  }
}
