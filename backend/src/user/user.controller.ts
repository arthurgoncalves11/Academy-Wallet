import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { OwnershipGuard } from '../auth/jwt-auth/ownership.guard';
import { UserCreatedDto } from './dto/user-created.dto';
import { RegisterDeviceTokenDto } from '../notification/dto/register-device-token.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo usuário',
    description:
      'Cria um usuário com e-mail, senha, CPF, RG e senha de transações.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
      },
    },
  })
  @ApiConflictResponse({
    description: 'E-mail ou CPF já cadastrados',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Busca usuário do token recebido',
    description:
      'Retorna os detalhes do usuário com base no token de autenticação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  async findOne(): Promise<UserResponseDto> {
    return await this.userService.findUser();
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Patch('/:id/first-access')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza o status do primeiro acesso',
    description:
      'Marca o primeiro acesso do usuário como concluído (firstAccess = false).',
  })
  @ApiParam({
    name: 'id',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Primeiro acesso atualizado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  async updateFirstAccess(@Param('id') id: string) {
    return await this.userService.updateFirstAccess(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/register_device')
  async registerTokenDevice(
    @Body() registerDeviceTokenDto: RegisterDeviceTokenDto,
  ) {
    return await this.userService.registerDeviceToken(
      registerDeviceTokenDto.token,
    );
  }
}
