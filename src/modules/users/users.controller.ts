import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { Public, OpenApi, ResponseBody } from 'core';
import { UsersService } from './users.service';
import { LoginUserDTO } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @Public()
  @OpenApi(LoginUserDTO)
  @HttpCode(200)
  async login(@Body() loginUserDTO: LoginUserDTO): Promise<ResponseBody> {
    const data = await this.usersService.login(loginUserDTO);

    return { message: 'Logged in!', data };
  }
}
