import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * 工厂函数，从执行上下文中，提取授权过的用户
 * Factory function that extracts the authenticated user from the execution context.
 * @internal 表示这里是一个内部实现细节，外部使用者不应该直接调用或依赖它
 *
 */
// keyof可以获取JwtPayloadDto中所有的键名，就是说data中，只可以获取指定的键
export const authUserFactory = (data: keyof JwtPayloadDto | undefined, ctx: ExecutionContext) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = ctx.switchToHttp().getRequest(); // 获取到请求
  const user = request.user as JwtPayloadDto; // 从请求中拿到user数据，并当作JwtPayloadDto处理

  return data ? user?.[data] : user; // 如果数据存在，返回数据，否则返回用户
};

/**
 * 自定义装饰器，从request中提取授权过的用户信息
 * 该装饰器从JWT payload中获取用户信息，该payload已经通过JWT 策略验证，并且附加在request对象上。
 *
 * Custom decorator to extract the authenticated user from the request.
 * This decorator retrieves the user information from the JWT payload
 * that has been validated and attached to the request by the JWT strategy.
 *
 * @example
 * ```typescript
 * // 这个案例表示，使用自定义装饰器装饰user，然后将提取到的用户信息赋值给user
 * @Get()
 * findAll(@AuthUser() user: JwtPayloadDto): Promise<Task[]> {
 *   return this.tasksService.findAll(user.id);
 * }
 * ```
 *
 * @example Extract specific property
 * ```typescript
 * // 这个案例表示，使用自定义装饰器，并且只获取提取到的用户的具体的信息
 * @Get()
 * findAll(@AuthUser('id') userId: string): Promise<Task[]> {
 *   return this.tasksService.findAll(userId);
 * }
 * ```
 */
export const AuthUser = createParamDecorator(authUserFactory);
