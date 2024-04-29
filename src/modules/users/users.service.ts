import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectRepository, Repository } from 'core';
import { User } from './entities/user.entity';
import { LoginUserDTO } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async login({ email, password }: LoginUserDTO): Promise<User> {
    const user = await this.usersRepo.raw(
      /*sql*/ `
        SELECT *
        FROM customers
        WHERE "email" = :email
      `,
      { email },
    );

    if (!user) {
      throw new NotFoundException('User not found!');
    } else if (password !== createHash('md5').update(password).digest('hex')) {
      throw new BadRequestException('Invalid password!');
    }

    return user;
  }
}
