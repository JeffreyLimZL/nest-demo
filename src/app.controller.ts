// 👇 新增引入了 Delete 和 Param
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Controller('user')
export class AppController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 1. 读取数据的房间 (GET)
  @Get('all')
  async getAllUsers() {
    const users = await this.userModel.find().exec();
    if (users.length === 0) {
      return { message: '目前云端金库里还没有数据哦' };
    }
    return users;
  }

  // 2. 写入数据的房间 (POST)
  @Post('add')
  async addUser(@Body() body: any) {
    const newUser = new this.userModel({
      name: body.name,
      milestone: body.milestone,
    });
    await newUser.save();
    return { message: '太牛了！NestJS 成功把数据永久保存在 MongoDB 啦！' };
  }

  // 👇 3. 新增的“拆迁办”专属通道 (DELETE)
  @Delete(':id') // 👈 冒号代表这是一个动态的占位符，用来接收你发来的专属 _id
  async deleteUser(@Param('id') id: string) {
    // 让高级搬运工去金库里根据 _id 找到这特条数据，并直接销毁！
    const result = await this.userModel.findByIdAndDelete(id).exec();
    
    // 如果找不到这条数据（可能已经被删了，或者 id 填错了）
    if (!result) {
      return { message: '找不到这条数据，是不是已经删过啦？' };
    }
    
    // 销毁成功后的欢呼
    return { message: `报告总管：ID为 ${id} 的数据已被彻底销毁！💥` };
  }
}