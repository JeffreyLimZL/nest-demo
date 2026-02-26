import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 👇 新增 1：引入 Swagger 的两个核心工具
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 允许前端网页来拿数据
  app.enableCors(); 
  // 开启安检员
  app.useGlobalPipes(new ValidationPipe());

  // 👇 新增 2：给说明书设计一个“封面”
  const config = new DocumentBuilder()
    .setTitle('🏢 我的云端后端大楼 API') // 说明书的标题
    .setDescription('这是我实习期间独立搭建的 NestJS + MongoDB 永久记忆金库！里面包含了完整的 CRUD 操作。') // 简介
    .setVersion('1.0') // 版本号
    .build();
  
  // 👇 新增 3：让系统根据你的代码和封面，自动生成这本说明书
  const document = SwaggerModule.createDocument(app, config);
  
  // 👇 新增 4：把说明书放在大楼的 "/api" 房间里供所有人查阅！
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();