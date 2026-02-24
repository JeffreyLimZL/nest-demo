import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Controller('user')
export class AppController {
  // 👇 给接待员配一个专门负责搬运 User 数据的“高级搬运工”（userModel）
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 1. 读取数据的房间
  @Get('all')
  async getAllUsers() {
    // 💡 只需要一行代码，就能去金库里把所有 User 数据拿出来！
    const users = await this.userModel.find().exec();
    
    if (users.length === 0) {
      return { message: '目前云端金库里还没有数据哦' };
    }
    return users;
  }

  // 2. 写入数据的房间
  @Post('add')
  async addUser(@Body() body: any) {
    // 按照前端传进来的数据，打包成一个新的 User 文件
    const newUser = new this.userModel({
      name: body.name,
      milestone: body.milestone,
    });
    
    // 💡 只需要一行代码，立刻存进 MongoDB 云端金库！
    await newUser.save();
    
    return { message: '太牛了！NestJS 成功把数据永久保存在 MongoDB 啦！' };
  }
}