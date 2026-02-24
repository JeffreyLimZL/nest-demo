import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 👇 新增：引入刚才画好的图纸
import { User, UserSchema } from './user.schema'; 

@Module({
  imports: [
    // 这是咱们之前接通大门的钥匙（记得填入你真实的连接代码！）
    MongooseModule.forRoot('mongodb+srv://jlzl011023_db_user:aojoxPusPI0qKke5@cluster0.v0djua2.mongodb.net/?appName=Cluster0'),
    
    // 👇 新增：告诉总管，我们要根据图纸，建一个专门放 User 资料的金库抽屉
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}