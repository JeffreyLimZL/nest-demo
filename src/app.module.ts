import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// 👇 新增引入：限流盾牌和保安队长
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; 
import { APP_GUARD } from '@nestjs/core'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    // 1. 隐形保险箱
    ConfigModule.forRoot(), 
    
    // 👇 2. 新增防刷盾牌：设定极其严格的规矩（60秒内，最多允许 5 次访问！）
    ThrottlerModule.forRoot([{
      ttl: 60000, // 时间窗口：60000 毫秒（也就是 1 分钟）
      limit: 5,   // 最大次数：5 次
    }]),

    // 3. 连接 MongoDB 金库
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    
    // 4. 注册数据表
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 👇 新增保安：把防刷盾牌强制应用到大楼的所有房间（包括 GET, POST, PATCH, DELETE）
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}