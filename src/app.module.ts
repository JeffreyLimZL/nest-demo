import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // 👈 新增：引入保险箱总管
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    // 👈 新增：必须放在最前面！让大楼启动时第一时间去读取 .env 保险箱
    ConfigModule.forRoot(), 
    
    // 👇 修改：以前这里是一大串明文密码，现在换成 process.env.MONGODB_URI（去保险箱拿钥匙）
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}