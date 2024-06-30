import { Controller, Get, Put, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.userService.getUsers({});
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.getUser({ user_id: id });
  }

  @Put(':id')
  async nicknameUpdate(
    @Param('id') id: string,
    @Query('nickname') nickname: string,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { user_id: id },
      data: { nickname },
    });
  }
}
