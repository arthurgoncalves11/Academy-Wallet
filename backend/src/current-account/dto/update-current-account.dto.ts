import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrentAccountDto } from './create-current-account.dto';

export class UpdateCurrentAccountDto extends PartialType(
  CreateCurrentAccountDto,
) {}
