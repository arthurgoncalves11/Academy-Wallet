import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketShareDto } from './create-market-share.dto';

export class UpdateMarketShareDto extends PartialType(CreateMarketShareDto) {}
