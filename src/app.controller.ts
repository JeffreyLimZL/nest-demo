import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
// 👇 引入我们写好的安检规矩（包含了新增的 CreateUserDto 和修改专用的 UpdateUserDto）
import { CreateUserDto, UpdateUserDto } from './user.dto'; 

@Controller('user')
export class AppController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 1. 读取数据的房间 (GET - Read)
  @Get('all')
  async getAllUsers() {
    const users = await this.userModel.find().exec();
    if (users.length === 0) {
      return { message: '目前云端金库里还没有数据哦' };
    }
    return users;
  }

  // 2. 写入数据的房间 (POST - Create)
  @Post('add')
  async addUser(@Body() body: CreateUserDto) { // 👈 这里用的是极其严格的 CreateUserDto
    const newUser = new this.userModel({
      name: body.name,
      milestone: body.milestone,
    });
    await newUser.save();
    return { message: '太牛了！NestJS 成功把数据永久保存在 MongoDB 啦！' };
  }

  // 3. 销毁数据的通道 (DELETE - Delete)
  @Delete(':id') 
  async deleteUser(@Param('id') id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      return { message: '找不到这条数据，是不是已经删过啦？' };
    }
    return { message: `报告总管：ID为 ${id} 的数据已被彻底销毁！💥` };
  }

  // 4. 修改数据的通道 (PATCH - Update)
  // 4. 修改数据的通道 (PATCH - Update)
  @Patch(':id') 
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { 
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      body, // 👈 极其关键！这里直接写 body，千万不能写成 { name: body.name } 了
      { new: true } 
    ).exec();

    if (!updatedUser) {
      return { message: '找不到这条数据，是不是 ID 填错啦？' };
    }

    return { 
      message: '太酷了！数据更新成功！✨',
      data: updatedUser 
    };
  }
}