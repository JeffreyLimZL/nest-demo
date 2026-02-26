import { Controller, Get, Post, Body, Delete, Param, Patch, Query } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './user.dto'; 
import { ApiQuery, ApiOperation } from '@nestjs/swagger'; // 👈 引入 Swagger 的雷达说明书工具

@Controller('user')
export class AppController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 1. 读取数据的房间 (GET - Read) - 终极雷达升级版（支持搜索与分页）
  @Get('all')
  @ApiOperation({ summary: '获取大楼访客（支持分页与名字搜索）' })
  @ApiQuery({ name: 'keyword', required: false, description: '想搜什么名字？（留空就查所有人）' })
  @ApiQuery({ name: 'page', required: false, description: '你想看第几页？（默认 1）' })
  @ApiQuery({ name: 'limit', required: false, description: '每一页拿几条数据？（默认 10）' })
  async getAllUsers(
    @Query('keyword') keyword?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // 1️⃣ 构建搜索雷达：如果传了 keyword，就去匹配名字
    const query = {};
    if (keyword) {
      // $regex 是模糊搜索，'i' 代表不区分大小写
      query['name'] = { $regex: keyword, $options: 'i' }; 
    }

    // 2️⃣ 计算分页数学题：
    // 假设你在第 2 页，每页 10 条。那么你需要跳过 (skip) 前 10 条数据。
    const skipAmount = (Number(page) - 1) * Number(limit);

    // 3️⃣ 派高级搬运工去金库按要求拿货
    const users = await this.userModel
      .find(query)          // 按名字搜
      .skip(skipAmount)     // 跳过前面的数据
      .limit(Number(limit)) // 严格限制只拿这几条
      .exec();
    
    // 4️⃣ 顺便统计一下总共有多少条符合条件的数据（前端画“下一页”按钮时需要用到）
    const totalCount = await this.userModel.countDocuments(query).exec();

    return {
      message: '数据雷达扫描完毕！',
      data: users,
      meta: { // 附赠分页说明书给前端
        total: totalCount,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    };
  }

  // 2. 写入数据的房间 (POST - Create)
  @Post('add')
  async addUser(@Body() body: CreateUserDto) { 
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
  @Patch(':id') 
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { 
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      body, 
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