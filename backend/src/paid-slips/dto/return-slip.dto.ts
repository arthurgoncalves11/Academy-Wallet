import { ApiProperty } from '@nestjs/swagger';

export class returnSlipDto {
  @ApiProperty({ description: 'Código da conta do cedente' })
  account: string;

  @ApiProperty({ description: 'Agência bancária' })
  agency: string;

  @ApiProperty({ description: 'Código de barras do boleto' })
  barcode: string;



  @ApiProperty({ description: 'CPF ou CNPJ do titular do boleto', example: '' })
  cpfOrCnpj: string;

  @ApiProperty({ description: 'Data de vencimento do boleto' })
  dateForExpirate: string;

  @ApiProperty({
    description: 'Data da operação',
    example: new Date().toISOString(),
  })
  dateToOperation: string;

  @ApiProperty({
    description: 'Data do pagamento',
    example: new Date().toISOString(),
  })
  dateToPay: string;

  @ApiProperty({
    description: 'Valor do desconto aplicado ao boleto',
    example: 0,
  })
  discount: number;

  @ApiProperty({ description: 'Taxas aplicadas ao boleto', example: 0 })
  fees: number;

  @ApiProperty({
    description: 'Instituição responsável pelo boleto',
    example: '',
  })
  institution: string;

  @ApiProperty({ description: 'Nome completo do banco emissor' })
  nameBank: string;

  @ApiProperty({
    description: 'Nome fantasia da empresa emissora',
    example: '',
  })
  nameFantasy: string;

  @ApiProperty({
    description: 'Valor da multa caso o boleto esteja vencido',
    example: 0,
  })
  penalty: number;

  @ApiProperty({ description: 'Razão social da empresa emissora', example: '' })
  legalName: string;

  @ApiProperty({ description: 'Valor nominal do boleto' })
  nominalValue: string;

  @ApiProperty({ description: 'Valor total a pagar pelo boleto' })
  valueToPay: string;
}
