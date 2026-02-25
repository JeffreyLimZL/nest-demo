import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 👇 新增：引入 NestJS 自带的全局安检管道
import { ValidationPipe } from '@nestjs/common'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 👇 新增：告诉大楼，所有进来的数据都要强制过一遍安检！
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();