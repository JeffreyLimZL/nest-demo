import { Controller, Get, Post, Body, Delete, Param, Patch, Query, UseGuards } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './user.dto'; 
import { ApiQuery, ApiOperation, ApiHeader } from '@nestjs/swagger'; 
import { AdminGuard } from './admin.guard'; // 👈 引入我们刚才写的铁面门卫

@Controller('user')
export class AppController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 1. 读取房间 (GET) - 所有人都可以进，不需要门卫！
  @Get('all')
  @ApiOperation({ summary: '获取大楼访客（所有人皆可访问）' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAllUsers(
    @Query('keyword') keyword?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const query = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
    const skipAmount = (Number(page) - 1) * Number(limit);
    const users = await this.userModel.find(query).skip(skipAmount).limit(Number(limit)).exec();
    const totalCount = await this.userModel.countDocuments(query).exec();

    return {
      message: '数据雷达扫描完毕！',
      data: users,
      meta: { total: totalCount, currentPage: Number(page), totalPages: Math.ceil(totalCount / Number(limit)) }
    };
  }

  // 2. 写入房间 (POST) - 👇 必须经过门卫的检查！
  @Post('add')
  @UseGuards(AdminGuard) // 👈 告诉 NestJS：这个房间由 AdminGuard 接管把守
  @ApiHeader({ name: 'x-api-key', description: '管理员专属指纹密码', required: true }) // 👈 让 Swagger 画出一个密码输入框
  async addUser(@Body() body: CreateUserDto) { 
    const newUser = new this.userModel({ name: body.name, milestone: body.milestone });
    await newUser.save();
    return { message: '太牛了！成功通过门卫检查，数据已写入金库！' };
  }

  // 3. 销毁通道 (DELETE) - 👇 必须经过门卫的检查！
  @Delete(':id') 
  @UseGuards(AdminGuard)
  @ApiHeader({ name: 'x-api-key', description: '管理员专属指纹密码', required: true })
  async deleteUser(@Param('id') id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) return { message: '找不到这条数据！' };
    return { message: `报告总管：ID为 ${id} 的数据已被彻底销毁！💥` };
  }

  // 4. 修改通道 (PATCH) - 👇 必须经过门卫的检查！
  @Patch(':id') 
  @UseGuards(AdminGuard)
  @ApiHeader({ name: 'x-api-key', description: '管理员专属指纹密码', required: true })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { 
    const updatedUser = await this.userModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedUser) return { message: '找不到这条数据！' };
    return { message: '太酷了！成功绕过门卫，数据更新成功！✨', data: updatedUser };
  }
}