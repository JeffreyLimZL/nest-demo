import { Injectable } from '@nestjs/common';
import * as fs from 'fs'; // 引入文件系统

@Injectable()
export class AppService {
  // 1. 读取数据的逻辑
  getAllUsers(): any {
    try {
      const data = fs.readFileSync('data.json', 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return { message: '目前还没有数据' };
    }
  }

  // 2. 存储数据的逻辑
  saveUser(userData: any): string {
    fs.writeFileSync('data.json', JSON.stringify(userData, null, 2));
    return 'NestJS 成功保存了数据！';
  }
}