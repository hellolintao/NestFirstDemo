import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 鉴权守卫，通过要求请求中有效的JWT来保护接口
 * JWT Authentication Guard
 * Protects endpoints by requiring a valid JWT present on the request.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 注入JwtService和Reflector，用户验证和条件反射
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super();
  }

  /**
   * 决定请求是否可以通过路由
   * Determines if the request can activate the route handler.
   * @param context The execution context containing request information. 包含了请求信息的执行上下文
   * @returns A boolean indicating if the request is authorized. 返回请求是否被授权的布尔值
   * @throws UnauthorizedException if the JWT is missing or invalid. 如果JWT未授权或者授权失败，则抛出异常
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查路由是否被标记为了isPublic
    // Check if the route is marked as public with the @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // If the route is public, allow access
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
