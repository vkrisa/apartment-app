import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role?: Role;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
