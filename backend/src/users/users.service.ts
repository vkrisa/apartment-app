import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUserMapper(_user: SignupDto) {
    const roleMapper = {
      [Role.client]: () =>
        this.prisma.client.create({
          data: { user: { create: _user } },
        }),
      [Role.owner]: async () =>
        this.prisma.owner.create({
          data: { user: { create: _user } },
        }),
    }[_user.role];

    return await roleMapper();
  }

  async createUser(createUserDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = { ...createUserDto, password: hashedPassword };

    try {
      return await this.createUserMapper(user);
    } catch (error) {
      throw new NotFoundException('Could not create user');
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }
}
