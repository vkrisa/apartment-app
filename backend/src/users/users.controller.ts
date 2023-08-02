import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOkResponse()
  async create() {
    return 'Ok';
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return new UserEntity(await this.usersService.findOne(id));
  }
}
