import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload = { sub: user.id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(signupDto: SignupDto): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const result = await this.usersService.createUser(signupDto);
    const payload = { sub: result.userId, role: signupDto.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
