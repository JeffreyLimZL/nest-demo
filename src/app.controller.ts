import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 访问 http://localhost:3000/user/all
  @Get('user/all')
  getUsers() {
    return this.appService.getAllUsers();
  }

  // 接收 POST 请求保存数据
  @Post('user/add')
  addUser(@Body() userData: any) {
    return this.appService.saveUser(userData);
  }
}