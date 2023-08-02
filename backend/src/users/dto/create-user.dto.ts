import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export type Role = 'CLIENT' | 'OWNER';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  role: Role;
}
