import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { LocalGuard } from 'src/auth/jwt.auth-guard';
import { HasRoles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HasRoles(Role.owner)
  @UseGuards(LocalGuard, RolesGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(LocalGuard)
  @ApiOkResponse({ type: UserEntity })
  async getUserById(@Param('id') id: string) {
    return new UserEntity(await this.usersService.findById(id));
  }
}
