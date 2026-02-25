// 引入安检员的检查工具
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '名字必须是文字形式哦！' })
  @IsNotEmpty({ message: '名字绝对不能为空！' })
  @MinLength(2, { message: '名字最少也要有两个字吧！' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '成就里程碑怎么能是空的呢！' })
  milestone: string;
}