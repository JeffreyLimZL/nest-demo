// 👇 新增引入了 Patch 
import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

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
  async addUser(@Body() body: any) {
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

  // 👇 4. 新增的修改通道 (PATCH - Update)
  @Patch(':id') // 同样需要占位符来接收 _id，告诉搬运工要改哪一条
  async updateUser(@Param('id') id: string, @Body() body: any) {
    // 拿着涂改液去金库里找数据并修改
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        milestone: body.milestone
      },
      { new: true } // 💡 极其关键的一句：告诉 MongoDB，改完之后，把“最新版本”的数据拿回来给我看看！
    ).exec();

    if (!updatedUser) {
      return { message: '找不到这条数据，修改失败哦！' };
    }

    return { 
      message: '太酷了！数据更新成功！✨',
      data: updatedUser // 把改完后的最新长相展示出来
    };
  }
}