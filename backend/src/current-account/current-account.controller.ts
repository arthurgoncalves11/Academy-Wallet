import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrentAccountService } from './current-account.service';
import { CreateCurrentAccountDto } from './dto/create-current-account.dto';
import { UpdateCurrentAccountDto } from './dto/update-current-account.dto';

@Controller('current-account')
export class CurrentAccountController {
  constructor(private readonly currentAccountService: CurrentAccountService) {}

  @Post()
  create(@Body() createCurrentAccountDto: CreateCurrentAccountDto) {
    // return this.currentAccountService.create(createCurrentAccountDto);
  }

  @Get()
  findAll() {
    return this.currentAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currentAccountService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrentAccountDto: UpdateCurrentAccountDto,
  ) {
    return this.currentAccountService.update(id, updateCurrentAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currentAccountService.remove(+id);
  }
}
