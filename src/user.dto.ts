import { IsString, IsNotEmpty, MinLength } from 'class-validator';
// 👇 确保这行引入了 PartialType
import { PartialType } from '@nestjs/swagger'; 

export class CreateUserDto {
  @IsString({ message: '名字必须是文字形式哦！' })
  @IsNotEmpty({ message: '名字绝对不能为空！' })
  @MinLength(2, { message: '名字最少也要有两个字吧！' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '成就里程碑怎么能是空的呢！' })
  milestone: string;
}

// 👇 确保最底下有这一行代码！这就是刚才总管找不到的 UpdateUserDto！
export class UpdateUserDto extends PartialType(CreateUserDto) {}