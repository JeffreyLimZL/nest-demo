import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // 门卫会在访客的请求头（Headers）里，寻找一张叫做 'x-api-key' 的通行证
    const apiKey = request.headers['x-api-key'];

    // 💡 这里就是你的专属指纹密码！只有出示 'super-admin-666' 的人才放行！
    if (apiKey !== 'super-admin-666') {
      throw new UnauthorizedException('🚨 警报！你没有大楼管理员权限，门卫拒绝了你的操作！');
    }
    
    return true; // 密码正确，门卫放行
  }
}