import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;
  email: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
