import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 本地验证的模式，一般是用于登录注册等接口（验证用户名和密码）
 * Guard that uses the 'local' strategy for authentication.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
