import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // 引入金库连接线
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 把你的“终极钥匙”粘贴在下面的引号里！
    MongooseModule.forRoot('mongodb+srv://jlzl011023_db_user:aojoxPusPI0qKke5@cluster0.v0djua2.mongodb.net/?appName=Cluster0'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}