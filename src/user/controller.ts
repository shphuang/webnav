import { Body, Controller, Delete, Get, Param, Post, Put } from '@danet/core';
import { User } from './class.ts';
import { UserService } from './service.ts';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  // 更新用户信息
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() user: User) {
    return this.userService.updateUser(id, user);
  }
}
